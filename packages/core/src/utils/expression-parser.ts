/**
 * Safe math expression evaluator using the Shunting-yard algorithm.
 * No `eval()` — tokenizes, converts to postfix (RPN), and evaluates.
 *
 * Supports:
 * - Arithmetic: `+`, `-`, `*`, `/`, `%` (modulo), `^` (power)
 * - Grouping: parentheses `()`
 * - Unary minus: `-5`, `(-3 + 2)`
 * - Functions: `floor`, `ceil`, `round`, `abs`, `min`, `max`
 *   (also accepts `Math.floor`, `Math.ceil`, etc.)
 *
 * Throws on invalid expressions, unknown functions, mismatched
 * parentheses, and division by zero.
 *
 * @module expression-parser
 */

type Token =
  | { type: "number"; value: number }
  | { type: "operator"; value: string }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "comma" }
  | { type: "function"; value: string };

const OPERATORS: Record<string, { precedence: number; assoc: "left" | "right" }> = {
  "+": { precedence: 1, assoc: "left" },
  "-": { precedence: 1, assoc: "left" },
  "*": { precedence: 2, assoc: "left" },
  "/": { precedence: 2, assoc: "left" },
  "%": { precedence: 2, assoc: "left" },
  "^": { precedence: 3, assoc: "right" },
};

const FUNCTIONS = new Set([
  "floor", "ceil", "round", "min", "max", "abs",
  "Math.floor", "Math.ceil", "Math.round", "Math.min", "Math.max", "Math.abs",
]);

/**
 * Tokenizes a math expression string into an array of typed tokens.
 * Handles numbers (including decimals and unary minus), operators,
 * parentheses, commas, and function names.
 *
 * @throws {Error} On unknown characters or function names
 */
function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const ch = expression[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (including decimals and negative numbers at start or after operator/lparen)
    if (/\d/.test(ch) || (ch === "." && i + 1 < expression.length && /\d/.test(expression[i + 1]))) {
      let num = "";
      while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === ".")) {
        num += expression[i];
        i++;
      }
      tokens.push({ type: "number", value: parseFloat(num) });
      continue;
    }

    // Unary minus: at start, after operator, after lparen, or after comma
    if (ch === "-" && (tokens.length === 0 ||
      tokens[tokens.length - 1].type === "operator" ||
      tokens[tokens.length - 1].type === "lparen" ||
      tokens[tokens.length - 1].type === "comma")) {
      let num = "-";
      i++;
      while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === ".")) {
        num += expression[i];
        i++;
      }
      if (num === "-") {
        // Not followed by a number — treat as operator
        tokens.push({ type: "operator", value: "-" });
      } else {
        tokens.push({ type: "number", value: parseFloat(num) });
      }
      continue;
    }

    // Operators
    if (ch in OPERATORS) {
      tokens.push({ type: "operator", value: ch });
      i++;
      continue;
    }

    // Parentheses
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }

    // Comma (for multi-arg functions like min, max)
    if (ch === ",") {
      tokens.push({ type: "comma" });
      i++;
      continue;
    }

    // Function names (Math.floor, floor, etc.)
    if (/[a-zA-Z]/.test(ch)) {
      let name = "";
      while (i < expression.length && /[a-zA-Z.]/.test(expression[i])) {
        name += expression[i];
        i++;
      }
      // Normalize: Math.floor → floor
      const normalized = name.startsWith("Math.") ? name : name;
      if (FUNCTIONS.has(name) || FUNCTIONS.has("Math." + name)) {
        tokens.push({ type: "function", value: normalized.replace("Math.", "") });
      } else {
        throw new Error(`Unknown function: ${name}`);
      }
      continue;
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  return tokens;
}

/**
 * Converts infix tokens to postfix (Reverse Polish Notation) using the
 * Shunting-yard algorithm. Respects operator precedence and associativity.
 *
 * @throws {Error} On mismatched parentheses
 */
function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "number":
        output.push(token);
        break;

      case "function":
        stack.push(token);
        break;

      case "comma":
        while (stack.length > 0 && stack[stack.length - 1].type !== "lparen") {
          output.push(stack.pop()!);
        }
        break;

      case "operator": {
        const op = OPERATORS[token.value];
        while (
          stack.length > 0 &&
          stack[stack.length - 1].type === "operator" &&
          ((op.assoc === "left" && op.precedence <= OPERATORS[(stack[stack.length - 1] as { value: string }).value].precedence) ||
           (op.assoc === "right" && op.precedence < OPERATORS[(stack[stack.length - 1] as { value: string }).value].precedence))
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
        break;
      }

      case "lparen":
        stack.push(token);
        break;

      case "rparen":
        while (stack.length > 0 && stack[stack.length - 1].type !== "lparen") {
          output.push(stack.pop()!);
        }
        if (stack.length === 0) throw new Error("Mismatched parentheses");
        stack.pop(); // Remove lparen
        // If top of stack is a function, pop it to output
        if (stack.length > 0 && stack[stack.length - 1].type === "function") {
          output.push(stack.pop()!);
        }
        break;
    }
  }

  while (stack.length > 0) {
    const top = stack.pop()!;
    if (top.type === "lparen") throw new Error("Mismatched parentheses");
    output.push(top);
  }

  return output;
}

/**
 * Evaluates a postfix (RPN) token array by processing each token
 * left to right, pushing numbers onto a stack and applying operators
 * and functions to stack operands.
 *
 * @throws {Error} On invalid expressions or division by zero
 */
function evaluatePostfix(postfix: Token[]): number {
  const stack: number[] = [];

  for (const token of postfix) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }

    if (token.type === "operator") {
      if (stack.length < 2) throw new Error("Invalid expression");
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token.value) {
        case "+": stack.push(a + b); break;
        case "-": stack.push(a - b); break;
        case "*": stack.push(a * b); break;
        case "/": {
          if (b === 0) throw new Error("Division by zero");
          stack.push(a / b);
          break;
        }
        case "%": {
          if (b === 0) throw new Error("Division by zero");
          stack.push(a % b);
          break;
        }
        case "^": stack.push(Math.pow(a, b)); break;
      }
      continue;
    }

    if (token.type === "function") {
      switch (token.value) {
        case "floor": {
          if (stack.length < 1) throw new Error("floor requires 1 argument");
          stack.push(Math.floor(stack.pop()!));
          break;
        }
        case "ceil": {
          if (stack.length < 1) throw new Error("ceil requires 1 argument");
          stack.push(Math.ceil(stack.pop()!));
          break;
        }
        case "round": {
          if (stack.length < 1) throw new Error("round requires 1 argument");
          stack.push(Math.round(stack.pop()!));
          break;
        }
        case "abs": {
          if (stack.length < 1) throw new Error("abs requires 1 argument");
          stack.push(Math.abs(stack.pop()!));
          break;
        }
        case "min": {
          if (stack.length < 2) throw new Error("min requires 2 arguments");
          const b = stack.pop()!;
          const a = stack.pop()!;
          stack.push(Math.min(a, b));
          break;
        }
        case "max": {
          if (stack.length < 2) throw new Error("max requires 2 arguments");
          const b = stack.pop()!;
          const a = stack.pop()!;
          stack.push(Math.max(a, b));
          break;
        }
      }
      continue;
    }
  }

  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

/**
 * Evaluates a math expression string and returns the numeric result.
 *
 * This is the primary export for numeric expressions. Internally it tokenizes
 * the input, converts to postfix via Shunting-yard, and evaluates the RPN stack.
 *
 * @param expression - A math expression string, e.g. `"(3 + 4) * 2"`
 * @returns The evaluated numeric result
 * @throws {Error} On invalid syntax, unknown functions, mismatched
 *   parentheses, or division by zero
 *
 * @example
 * ```ts
 * evaluateMathExpression("(3 + 4) * 2");  // 14
 * evaluateMathExpression("floor(3.7)");   // 3
 * evaluateMathExpression("max(10, 20)");  // 20
 * ```
 */
export function evaluateMathExpression(expression: string): number {
  const tokens = tokenize(expression);
  const postfix = toPostfix(tokens);
  return evaluatePostfix(postfix);
}

// ---- String, Date, and Conditional Functions ----

/**
 * Evaluates a function expression that returns a string, number, or date.
 *
 * Supported functions:
 * - **String**: `UPPER(s)`, `LOWER(s)`, `TRIM(s)`, `LEN(s)`, `CONCAT(a, b, ...)`
 * - **Date**: `TODAY()`, `DATEDIFF(d1, d2, unit)`, `DATEADD(date, amount, unit)`
 * - **Conditional**: `IF(condition, trueVal, falseVal)`
 *
 * @param funcName - The function name (case-insensitive).
 * @param args - Arguments to the function.
 * @returns The result of the function evaluation.
 * @throws {Error} On unknown functions or invalid arguments.
 *
 * @example
 * ```ts
 * evaluateFunction("UPPER", ["hello"]);       // "HELLO"
 * evaluateFunction("LEN", ["hello"]);          // 5
 * evaluateFunction("TODAY", []);               // "2024-01-15" (ISO date string)
 * evaluateFunction("DATEDIFF", ["2024-01-01", "2024-01-31", "days"]); // 30
 * evaluateFunction("IF", [true, "yes", "no"]); // "yes"
 * ```
 *
 * @since 1.4.0
 */
export function evaluateFunction(
  funcName: string,
  args: unknown[],
): unknown {
  const name = funcName.toUpperCase();

  switch (name) {
    // ---- String functions ----
    case "UPPER":
      assertArgCount(name, args, 1);
      return String(args[0] ?? "").toUpperCase();

    case "LOWER":
      assertArgCount(name, args, 1);
      return String(args[0] ?? "").toLowerCase();

    case "TRIM":
      assertArgCount(name, args, 1);
      return String(args[0] ?? "").trim();

    case "LEN":
      assertArgCount(name, args, 1);
      return String(args[0] ?? "").length;

    case "CONCAT":
      if (args.length < 1) throw new Error("CONCAT requires at least 1 argument");
      return args.map((a) => String(a ?? "")).join("");

    // ---- Date functions ----
    case "TODAY":
      return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    case "DATEDIFF": {
      assertArgCount(name, args, 3);
      const d1 = new Date(String(args[0]));
      const d2 = new Date(String(args[1]));
      const unit = String(args[2]).toLowerCase();
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        throw new Error("DATEDIFF: invalid date argument");
      }
      const diffMs = d2.getTime() - d1.getTime();
      switch (unit) {
        case "days": return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        case "hours": return Math.floor(diffMs / (1000 * 60 * 60));
        case "minutes": return Math.floor(diffMs / (1000 * 60));
        case "seconds": return Math.floor(diffMs / 1000);
        case "weeks": return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        case "months": return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
        case "years": return d2.getFullYear() - d1.getFullYear();
        default: throw new Error(`DATEDIFF: unknown unit "${unit}". Use days, hours, minutes, seconds, weeks, months, or years`);
      }
    }

    case "DATEADD": {
      assertArgCount(name, args, 3);
      const date = new Date(String(args[0]));
      const amount = Number(args[1]);
      const unit = String(args[2]).toLowerCase();
      if (isNaN(date.getTime())) throw new Error("DATEADD: invalid date argument");
      if (isNaN(amount)) throw new Error("DATEADD: amount must be a number");
      const result = new Date(date);
      switch (unit) {
        case "days": result.setDate(result.getDate() + amount); break;
        case "hours": result.setHours(result.getHours() + amount); break;
        case "minutes": result.setMinutes(result.getMinutes() + amount); break;
        case "seconds": result.setSeconds(result.getSeconds() + amount); break;
        case "weeks": result.setDate(result.getDate() + amount * 7); break;
        case "months": result.setMonth(result.getMonth() + amount); break;
        case "years": result.setFullYear(result.getFullYear() + amount); break;
        default: throw new Error(`DATEADD: unknown unit "${unit}". Use days, hours, minutes, seconds, weeks, months, or years`);
      }
      return result.toISOString().split("T")[0]; // "YYYY-MM-DD"
    }

    // ---- Conditional ----
    case "IF":
      assertArgCount(name, args, 3);
      return args[0] ? args[1] : args[2];

    default:
      throw new Error(`Unknown function: ${funcName}`);
  }
}

function assertArgCount(name: string, args: unknown[], expected: number): void {
  if (args.length < expected) {
    throw new Error(`${name} requires ${expected} argument(s), got ${args.length}`);
  }
}
