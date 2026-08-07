export { contactFormSchema } from "./contact-form";
export { textFieldsDemo } from "./text-fields-demo";
export { selectionFieldsDemo } from "./selection-fields-demo";
export { numericFieldsDemo } from "./numeric-fields-demo";
export { datetimeMediaDemo } from "./datetime-media-demo";
export { advancedFieldsDemo } from "./advanced-fields-demo";
export { conditionalLogicDemo } from "./conditional-logic-demo";
export { multiSectionDemo } from "./multi-section-demo";
export { customerSurveyDemo } from "./customer-survey-demo";
export { jobApplicationDemo } from "./job-application-demo";

import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import { contactFormSchema } from "./contact-form";
import { textFieldsDemo } from "./text-fields-demo";
import { selectionFieldsDemo } from "./selection-fields-demo";
import { numericFieldsDemo } from "./numeric-fields-demo";
import { datetimeMediaDemo } from "./datetime-media-demo";
import { advancedFieldsDemo } from "./advanced-fields-demo";
import { conditionalLogicDemo } from "./conditional-logic-demo";
import { multiSectionDemo } from "./multi-section-demo";
import { customerSurveyDemo } from "./customer-survey-demo";
import { jobApplicationDemo } from "./job-application-demo";

export interface DemoEntry {
  id: string;
  title: string;
  description: string;
  category: "field-types" | "features" | "real-world";
  schema: FormEngineSchema;
}

export const demos: DemoEntry[] = [
  // Field type demos
  {
    id: "text-fields",
    title: "Text Fields",
    description:
      "Short text, long text, email, phone, international phone, URL, and legal name inputs.",
    category: "field-types",
    schema: textFieldsDemo,
  },
  {
    id: "selection-fields",
    title: "Selection Fields",
    description:
      "Radio buttons, checkboxes, dropdowns, toggles, country picker, and drag-to-rank lists.",
    category: "field-types",
    schema: selectionFieldsDemo,
  },
  {
    id: "numeric-fields",
    title: "Numeric & Ratings",
    description:
      "Number inputs, range sliders, star ratings, NPS scores, Likert scales, and opinion scales.",
    category: "field-types",
    schema: numericFieldsDemo,
  },
  {
    id: "datetime-media",
    title: "Date, Time & Media",
    description:
      "Date pickers, date ranges, time selectors, appointment scheduling, file uploads, signatures, and image capture.",
    category: "field-types",
    schema: datetimeMediaDemo,
  },
  {
    id: "advanced-fields",
    title: "Advanced Fields",
    description:
      "Structured address, payment, matrix grids, repeating groups, calculated values, hidden fields, and consent blocks.",
    category: "field-types",
    schema: advancedFieldsDemo,
  },

  // Feature demos
  {
    id: "conditional-logic",
    title: "Conditional Logic",
    description:
      "Fields that show, hide, or change based on previous answers. Includes nested and multi-condition rules.",
    category: "features",
    schema: conditionalLogicDemo,
  },
  {
    id: "multi-section",
    title: "Multi-Step Wizard",
    description:
      "A 4-step form with progress tracking, back/next navigation, and automatic draft saving.",
    category: "features",
    schema: multiSectionDemo,
  },

  // Real-world form demos
  {
    id: "contact-form",
    title: "Contact Form",
    description:
      "A simple 2-section contact form with email validation and a subject dropdown.",
    category: "real-world",
    schema: contactFormSchema,
  },
  {
    id: "customer-survey",
    title: "Customer Survey",
    description:
      "NPS scoring, satisfaction ratings, feature usage checkboxes, and conditional follow-up questions.",
    category: "real-world",
    schema: customerSurveyDemo,
  },
  {
    id: "job-application",
    title: "Job Application",
    description:
      "Multi-step hiring form with resume upload, salary slider, tech stack selection, and data consent.",
    category: "real-world",
    schema: jobApplicationDemo,
  },
];
