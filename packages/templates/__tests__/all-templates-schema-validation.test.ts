import { describe, it, expect } from "vitest";
import { validateSchema } from "@squaredr/fieldcraft-core";
import {
  allTemplates,
  contactForm,
  feedbackSurvey,
  npsSurvey,
  newsletterSignup,
  bugReport,
  eventRegistration,
  leadGeneration,
  featureRequest,
  poll,
  quiz,
  jobApplication,
  onboardingChecklist,
  exitInterview,
  review360,
  timeOffRequest,
  expenseReport,
} from "../src";

describe("All 16 Templates - Comprehensive Schema Validation & Metadata Audit", () => {
  it("contains exactly 16 production-ready form templates", () => {
    expect(allTemplates).toHaveLength(16);
  });

  const templatesList = [
    { name: "Contact Form", template: contactForm },
    { name: "Feedback Survey", template: feedbackSurvey },
    { name: "NPS Survey", template: npsSurvey },
    { name: "Newsletter Signup", template: newsletterSignup },
    { name: "Bug Report", template: bugReport },
    { name: "Event Registration", template: eventRegistration },
    { name: "Lead Generation", template: leadGeneration },
    { name: "Feature Request", template: featureRequest },
    { name: "Poll", template: poll },
    { name: "Quiz", template: quiz },
    { name: "Job Application", template: jobApplication },
    { name: "Onboarding Checklist", template: onboardingChecklist },
    { name: "Exit Interview", template: exitInterview },
    { name: "360 Review", template: review360 },
    { name: "Time-Off Request", template: timeOffRequest },
    { name: "Expense Report", template: expenseReport },
  ];

  templatesList.forEach(({ name, template }) => {
    describe(`Template: ${name} (${template.meta.id})`, () => {
      it("has complete and valid metadata", () => {
        expect(template.meta.id).toBeDefined();
        expect(typeof template.meta.id).toBe("string");
        expect(template.meta.name).toBeDefined();
        expect(template.meta.description).toBeDefined();
        expect(template.meta.category).toBeDefined();
        expect(Array.isArray(template.meta.tags)).toBe(true);
        expect(template.meta.tags.length).toBeGreaterThan(0);
      });

      it("passes strict JSON schema validation with zero schema errors", () => {
        const validated = validateSchema(template.schema);
        expect(validated).toBeDefined();
        expect(validated.id).toBe(template.schema.id);
        expect(validated.sections.length).toBeGreaterThan(0);
      });

      it("ensures every question in every section has unique ID and valid type", () => {
        const questionIds = new Set<string>();
        const sectionIds = new Set<string>();

        template.schema.sections.forEach((section) => {
          expect(section.id).toBeDefined();
          expect(sectionIds.has(section.id)).toBe(false);
          sectionIds.add(section.id);

          expect(section.questions.length).toBeGreaterThan(0);
          section.questions.forEach((q) => {
            expect(q.id).toBeDefined();
            expect(q.type).toBeDefined();
            expect(q.label).toBeDefined();
            expect(questionIds.has(q.id)).toBe(false);
            questionIds.add(q.id);
          });
        });
      });
    });
  });
});
