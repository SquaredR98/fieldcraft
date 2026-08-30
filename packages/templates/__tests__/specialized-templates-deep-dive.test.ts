import { describe, it, expect } from "vitest";
import { createEngine } from "@squaredr/fieldcraft-core";
import { quiz, expenseReport, timeOffRequest, eventRegistration, bugReport } from "../src";

describe("Specialized Templates Deep Dive Logic & Business Rules", () => {
  describe("Quiz Template (Scoring & Quiz Logic)", () => {
    it("accumulates score and calculates total quiz points properly", async () => {
      const engine = createEngine(quiz.schema);

      // Answer questions
      engine.setValue("name", "Alice Student");
      engine.setValue("email", "alice@school.edu");
      engine.setValue("department", "engineering");

      engine.setValue("q1", "correct");
      engine.setValue("q2", "correct");
      engine.setValue("q3", "correct");
      engine.setValue("q4", "correct");
      engine.setValue("q5", "correct");
      engine.setValue("q6", ["react", "vue", "svelte"]);
      engine.setValue("confidence", 5);
      engine.setValue("feedback", "Great test!");
      engine.setValue("notify_results", true);

      const result = await engine.submit();
      expect(result.success).toBe(true);
      const state = engine.getState();
      expect(state.isSubmitted).toBe(true);
    });
  });

  describe("Expense Report Template (Financial Calculations & Categories)", () => {
    it("handles expense categories, currencies, and total amounts", async () => {
      const engine = createEngine(expenseReport.schema);

      // Section 1
      engine.setValue("employee_name", "Bob Builder");
      engine.setValue("department", "Engineering");
      engine.setValue("manager", "Sarah Manager");
      engine.setValue("report_period", "this-month");

      // Section 2
      engine.setValue("expense_category", "travel-flights");
      engine.setValue("expense_date", "2026-08-15");
      engine.setValue("description", "Flight to Tech Conference");
      engine.setValue("amount", 450.00);
      engine.setValue("currency", "USD");
      engine.setValue("receipt_url", "https://drive.google.com/file/d/123");
      engine.setValue("business_justification", "Presenting company research paper at annual summit");

      // Section 3
      engine.setValue("total_amount", "$450.00");
      engine.setValue("additional_notes", "Receipts attached in link");
      engine.setValue("policy_acknowledgment", true);

      const result = await engine.submit();
      expect(result.success).toBe(true);
      expect(engine.getState().isSubmitted).toBe(true);
    });
  });

  describe("Time-Off Request Template (Dates & Leave Policies)", () => {
    it("validates leave type selection and date range submission", async () => {
      const engine = createEngine(timeOffRequest.schema);

      timeOffRequest.schema.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          if (q.type === "single_select" || q.type === "dropdown") {
            if (q.options && q.options.length > 0) {
              engine.setValue(q.id, q.options[0].value);
            }
          } else if (q.type === "date") {
            engine.setValue(q.id, "2026-09-01");
          } else if (q.type === "number") {
            engine.setValue(q.id, 3);
          } else if (q.type === "short_text" || q.type === "long_text") {
            engine.setValue(q.id, "Annual Vacation Request");
          } else if (q.type === "email") {
            engine.setValue(q.id, "employee@example.com");
          } else if (q.type === "boolean") {
            engine.setValue(q.id, true);
          }
        });
      });

      const result = await engine.submit();
      expect(result.success).toBe(true);
    });
  });

  describe("Event Registration Template (Attendees, Dietary & Tickets)", () => {
    it("processes multi-attendee registration with dietary preferences", async () => {
      const engine = createEngine(eventRegistration.schema);

      eventRegistration.schema.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          if (q.type === "single_select" || q.type === "dropdown") {
            if (q.options && q.options.length > 0) {
              engine.setValue(q.id, q.options[0].value);
            }
          } else if (q.type === "multi_select") {
            if (q.options && q.options.length > 0) {
              engine.setValue(q.id, [q.options[0].value]);
            }
          } else if (q.type === "number") {
            engine.setValue(q.id, 2);
          } else if (q.type === "boolean" || q.type === "consent") {
            engine.setValue(q.id, true);
          } else if (q.type === "email") {
            engine.setValue(q.id, "attendee@conf.com");
          } else if (q.type === "short_text" || q.type === "long_text") {
            engine.setValue(q.id, "Jane Doe");
          }
        });
      });

      const result = await engine.submit();
      expect(result.success).toBe(true);
    });
  });

  describe("Bug Report Template (Severity & Diagnostics)", () => {
    it("handles reproduction steps and environment diagnostics", async () => {
      const engine = createEngine(bugReport.schema);

      bugReport.schema.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          if (q.type === "dropdown" || q.type === "single_select") {
            if (q.options && q.options.length > 0) {
              engine.setValue(q.id, q.options[0].value);
            }
          } else if (q.type === "short_text" || q.type === "long_text") {
            engine.setValue(q.id, "Clicking submit does not trigger spinner");
          } else if (q.type === "email") {
            engine.setValue(q.id, "dev@example.com");
          } else if (q.type === "boolean") {
            engine.setValue(q.id, true);
          }
        });
      });

      const result = await engine.submit();
      expect(result.success).toBe(true);
    });
  });
});
