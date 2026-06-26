import { describe, it, expect } from "vitest";
import { evaluateMathExpression } from "../src/utils/expression-parser";

describe("evaluateMathExpression", () => {
  describe("basic arithmetic", () => {
    it("adds two numbers", () => {
      expect(evaluateMathExpression("3 + 5")).toBe(8);
    });

    it("subtracts two numbers", () => {
      expect(evaluateMathExpression("10 - 4")).toBe(6);
    });

    it("multiplies two numbers", () => {
      expect(evaluateMathExpression("6 * 7")).toBe(42);
    });

    it("divides two numbers", () => {
      expect(evaluateMathExpression("20 / 4")).toBe(5);
    });

    it("raises to a power", () => {
      expect(evaluateMathExpression("2 ^ 10")).toBe(1024);
    });
  });

  describe("operator precedence", () => {
    it("multiplication before addition", () => {
      expect(evaluateMathExpression("2 + 3 * 4")).toBe(14);
    });

    it("division before subtraction", () => {
      expect(evaluateMathExpression("10 - 6 / 2")).toBe(7);
    });

    it("power before multiplication", () => {
      expect(evaluateMathExpression("2 * 3 ^ 2")).toBe(18);
    });

    it("respects left-to-right for same precedence", () => {
      expect(evaluateMathExpression("10 - 3 - 2")).toBe(5);
      expect(evaluateMathExpression("24 / 6 / 2")).toBe(2);
    });

    it("power is right-associative", () => {
      // 2 ^ 3 ^ 2 = 2 ^ (3 ^ 2) = 2 ^ 9 = 512
      expect(evaluateMathExpression("2 ^ 3 ^ 2")).toBe(512);
    });
  });

  describe("parentheses", () => {
    it("overrides operator precedence", () => {
      expect(evaluateMathExpression("(2 + 3) * 4")).toBe(20);
    });

    it("supports nested parentheses", () => {
      expect(evaluateMathExpression("((2 + 3) * (4 - 1))")).toBe(15);
    });

    it("supports deeply nested parentheses", () => {
      expect(evaluateMathExpression("(((1 + 2)))")).toBe(3);
    });

    it("throws on mismatched opening parenthesis", () => {
      expect(() => evaluateMathExpression("(2 + 3")).toThrow("Mismatched parentheses");
    });

    it("throws on mismatched closing parenthesis", () => {
      expect(() => evaluateMathExpression("2 + 3)")).toThrow("Mismatched parentheses");
    });
  });

  describe("negative numbers", () => {
    it("handles unary minus at start", () => {
      expect(evaluateMathExpression("-5 + 3")).toBe(-2);
    });

    it("handles unary minus after operator", () => {
      expect(evaluateMathExpression("10 + -3")).toBe(7);
    });

    it("handles unary minus after open paren", () => {
      expect(evaluateMathExpression("(-5) * 2")).toBe(-10);
    });

    it("handles negative result from subtraction", () => {
      expect(evaluateMathExpression("3 - 10")).toBe(-7);
    });
  });

  describe("decimal numbers", () => {
    it("handles decimal operands", () => {
      expect(evaluateMathExpression("1.5 + 2.5")).toBe(4);
    });

    it("handles decimal starting with dot", () => {
      expect(evaluateMathExpression(".5 + .5")).toBe(1);
    });

    it("handles small decimal multiplication", () => {
      expect(evaluateMathExpression("0.1 * 10")).toBeCloseTo(1);
    });
  });

  describe("whitespace handling", () => {
    it("works without spaces", () => {
      expect(evaluateMathExpression("3+5")).toBe(8);
    });

    it("works with extra spaces", () => {
      expect(evaluateMathExpression("  3  +  5  ")).toBe(8);
    });

    it("works with tabs", () => {
      expect(evaluateMathExpression("3\t+\t5")).toBe(8);
    });
  });

  describe("division by zero", () => {
    it("throws on division by zero", () => {
      expect(() => evaluateMathExpression("10 / 0")).toThrow("Division by zero");
    });

    it("throws on indirect division by zero", () => {
      expect(() => evaluateMathExpression("10 / (5 - 5)")).toThrow("Division by zero");
    });
  });

  describe("math functions", () => {
    it("floor rounds down", () => {
      expect(evaluateMathExpression("floor(3.7)")).toBe(3);
      expect(evaluateMathExpression("floor(-1.2)")).toBe(-2);
    });

    it("ceil rounds up", () => {
      expect(evaluateMathExpression("ceil(3.2)")).toBe(4);
      expect(evaluateMathExpression("ceil(-1.8)")).toBe(-1);
    });

    it("round rounds to nearest", () => {
      expect(evaluateMathExpression("round(3.5)")).toBe(4);
      expect(evaluateMathExpression("round(3.4)")).toBe(3);
    });

    it("abs returns absolute value", () => {
      expect(evaluateMathExpression("abs(-42)")).toBe(42);
      expect(evaluateMathExpression("abs(42)")).toBe(42);
    });

    it("min returns the smaller of two values", () => {
      expect(evaluateMathExpression("min(3, 7)")).toBe(3);
      expect(evaluateMathExpression("min(10, -5)")).toBe(-5);
    });

    it("max returns the larger of two values", () => {
      expect(evaluateMathExpression("max(3, 7)")).toBe(7);
      expect(evaluateMathExpression("max(-10, -5)")).toBe(-5);
    });

    it("supports Math.* prefix", () => {
      expect(evaluateMathExpression("Math.floor(4.9)")).toBe(4);
      expect(evaluateMathExpression("Math.ceil(4.1)")).toBe(5);
      expect(evaluateMathExpression("Math.round(4.5)")).toBe(5);
      expect(evaluateMathExpression("Math.abs(-7)")).toBe(7);
      expect(evaluateMathExpression("Math.min(2, 8)")).toBe(2);
      expect(evaluateMathExpression("Math.max(2, 8)")).toBe(8);
    });

    it("functions compose with arithmetic", () => {
      expect(evaluateMathExpression("floor(10 / 3) * 2")).toBe(6);
      expect(evaluateMathExpression("max(2 + 3, 4 + 1)")).toBe(5);
    });
  });

  describe("complex expressions", () => {
    it("evaluates BMI formula pattern", () => {
      // BMI = weight * 703 / (height ^ 2)
      // weight=150, height=65 → 150 * 703 / (65 ^ 2) = 105450 / 4225 ≈ 24.96
      const result = evaluateMathExpression("150 * 703 / (65 ^ 2)");
      expect(result).toBeCloseTo(24.96, 1);
    });

    it("evaluates compound interest pattern", () => {
      // A = P * (1 + r) ^ n → 1000 * (1 + 0.05) ^ 10
      const result = evaluateMathExpression("1000 * (1 + 0.05) ^ 10");
      expect(result).toBeCloseTo(1628.89, 1);
    });

    it("handles chained operations", () => {
      expect(evaluateMathExpression("1 + 2 + 3 + 4 + 5")).toBe(15);
    });
  });

  describe("error handling", () => {
    it("throws on unknown function", () => {
      expect(() => evaluateMathExpression("sin(3)")).toThrow("Unknown function: sin");
    });

    it("throws on unexpected character", () => {
      expect(() => evaluateMathExpression("3 & 5")).toThrow("Unexpected character: &");
    });

    it("throws on invalid expression (missing operand)", () => {
      expect(() => evaluateMathExpression("+")).toThrow();
    });

    it("throws on empty expression after operator", () => {
      expect(() => evaluateMathExpression("5 *")).toThrow();
    });
  });
});
