import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormEngineRenderer } from "../../src/components/FormEngineRenderer";
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
} from "@squaredr/fieldcraft-templates";

describe("All 16 Templates - React DOM Mounting & Field Rendering", () => {
  it("has exactly 16 templates available for rendering", () => {
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
    describe(`React Rendering: ${name} (${template.meta.id})`, () => {
      it("renders the first section title and its field elements in the DOM", () => {
        const { container } = render(<FormEngineRenderer schema={template.schema} />);
        expect(container).toBeInTheDocument();

        const firstSection = template.schema.sections[0];
        if (firstSection.title) {
          expect(screen.getByText(firstSection.title)).toBeInTheDocument();
        }

        // Verify that the first question in the initial section has its label rendered
        const firstQuestion = firstSection.questions[0];
        if (firstQuestion && firstQuestion.label) {
          expect(screen.getByText(firstQuestion.label)).toBeInTheDocument();
        }
      });
    });
  });
});
