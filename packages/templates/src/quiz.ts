import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const quizSchema: FormEngineSchema = {
  id: "quiz",
  version: "1.0.0",
  title: "Product Knowledge Quiz",
  description:
    "Test your knowledge! Answer the questions below and see how you score.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
    navigation: {
      showBack: true,
      allowSkip: false,
    },
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "participant",
      title: "Before We Begin",
      description: "Quick details so we can track your score",
      questions: [
        {
          id: "name",
          type: "short_text",
          label: "Your Name",
          required: true,
          placeholder: "Jane Doe",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "you@company.com",
          helpText: "We'll send your results here",
        },
        {
          id: "department",
          type: "dropdown",
          label: "Department",
          required: false,
          options: [
            { label: "Engineering", value: "engineering" },
            { label: "Product", value: "product" },
            { label: "Design", value: "design" },
            { label: "Sales", value: "sales" },
            { label: "Marketing", value: "marketing" },
            { label: "Support", value: "support" },
            { label: "Other", value: "other" },
          ],
        },
      ],
    },
    {
      id: "questions-easy",
      title: "Round 1: Basics",
      description: "Let's start with the fundamentals",
      questions: [
        {
          id: "q1",
          type: "single_select",
          label: "What does SaaS stand for?",
          required: true,
          options: [
            { label: "Software as a Service", value: "correct" },
            { label: "System and Application Software", value: "wrong-1" },
            { label: "Storage as a Service", value: "wrong-2" },
            { label: "Secure Application System", value: "wrong-3" },
          ],
        },
        {
          id: "q2",
          type: "single_select",
          label: "Which of these is a version control system?",
          required: true,
          options: [
            { label: "Docker", value: "wrong-1" },
            { label: "Git", value: "correct" },
            { label: "Kubernetes", value: "wrong-2" },
            { label: "Terraform", value: "wrong-3" },
          ],
        },
        {
          id: "q3",
          type: "single_select",
          label: "What is the purpose of an API?",
          required: true,
          options: [
            { label: "To style web pages", value: "wrong-1" },
            { label: "To allow different software systems to communicate", value: "correct" },
            { label: "To compile source code", value: "wrong-2" },
            { label: "To manage databases", value: "wrong-3" },
          ],
        },
      ],
    },
    {
      id: "questions-advanced",
      title: "Round 2: Advanced",
      description: "Now let's test your deeper knowledge",
      questions: [
        {
          id: "q4",
          type: "single_select",
          label: "In REST APIs, which HTTP method is typically used to update an existing resource?",
          required: true,
          options: [
            { label: "GET", value: "wrong-1" },
            { label: "POST", value: "wrong-2" },
            { label: "PUT", value: "correct" },
            { label: "DELETE", value: "wrong-3" },
          ],
        },
        {
          id: "q5",
          type: "single_select",
          label: "What does CI/CD stand for?",
          required: true,
          options: [
            { label: "Code Integration / Code Delivery", value: "wrong-1" },
            { label: "Continuous Integration / Continuous Deployment", value: "correct" },
            { label: "Complete Integration / Complete Deployment", value: "wrong-2" },
            { label: "Central Intelligence / Central Database", value: "wrong-3" },
          ],
        },
        {
          id: "q6",
          type: "multi_select",
          label: "Which of these are JavaScript frameworks or libraries? (Select all that apply)",
          required: true,
          helpText: "There may be more than one correct answer",
          options: [
            { label: "React", value: "react" },
            { label: "Django", value: "django" },
            { label: "Vue", value: "vue" },
            { label: "Laravel", value: "laravel" },
            { label: "Svelte", value: "svelte" },
            { label: "Flask", value: "flask" },
          ],
        },
        {
          id: "confidence",
          type: "rating",
          label: "How confident are you in your answers?",
          required: false,
        },
        {
          id: "feedback",
          type: "long_text",
          label: "Any feedback on the quiz?",
          required: false,
          placeholder: "Was it too easy? Too hard? Suggestions?",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "notify_results",
          type: "boolean",
          label: "Email me the correct answers after the quiz closes",
          required: false,
        },
      ],
    },
  ],
};

export const quizMeta = {
  id: "quiz",
  name: "Product Knowledge Quiz",
  description:
    "A 3-section quiz with participant info, basic questions, and advanced questions. Uses single-select for multiple choice, multi-select for select-all-that-apply, plus confidence rating and feedback.",
  category: "general" as const,
  fieldCount: 12,
  sectionCount: 3,
  tags: ["quiz", "assessment", "knowledge", "scoring", "multi-step"],
};

export const quiz: Template = {
  meta: quizMeta,
  schema: quizSchema,
};
