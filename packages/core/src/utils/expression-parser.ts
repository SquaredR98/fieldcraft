/**
 * Safe math expression evaluator using the Shunting-yard algorithm.
 * NO eval() — parses and evaluates a mathematical expression safely.
 *
 * Supports: numbers, +, -, *, /, ^ (power), parentheses,
 * Math.floor, Math.ceil, Math.round, Math.min, Math.max, Math.abs
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
  "^": { precedence: 3, assoc: "right" },
};

const FUNCTIONS = new Set([
  "floor", "ceil", "round", "min", "max", "abs",
  "Math.floor", "Math.ceil", "Math.round", "Math.min", "Math.max", "Math.abs",
]);

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
 * Shunting-yard algorithm: convert infix tokens to postfix (RPN).
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
 * Evaluate postfix (RPN) token array to produce a number.
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
        case "/": stack.push(b === 0 ? NaN : a / b); break;
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
 * Evaluate a math expression string and return the result.
 * Throws on invalid expressions.
 */
export function evaluateMathExpression(expression: string): number {
  const tokens = tokenize(expression);
  const postfix = toPostfix(tokens);
  return evaluatePostfix(postfix);
}
