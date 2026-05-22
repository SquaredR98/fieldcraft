import type { FormEngineSchema, Option } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

const satisfactionOptions: Option[] = [
  { label: "Very Dissatisfied", value: 1 },
  { label: "Dissatisfied", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Satisfied", value: 4 },
  { label: "Very Satisfied", value: 5 },
];

export const exitInterviewSchema: FormEngineSchema = {
  id: "exit-interview",
  version: "1.0.0",
  title: "Exit Interview",
  description:
    "Your feedback helps us improve. All responses are confidential and reviewed by HR leadership.",
  settings: {
    showProgress: true,
    progressStyle: "steps",
    navigation: {
      showBack: true,
    },
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "departure",
      title: "About Your Departure",
      questions: [
        {
          id: "department",
          type: "short_text",
          label: "Department",
          required: true,
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "tenure",
          type: "single_select",
          label: "How long did you work here?",
          required: true,
          options: [
            { label: "Less than 6 months", value: "0-6m" },
            { label: "6 months - 1 year", value: "6m-1y" },
            { label: "1-2 years", value: "1-2y" },
            { label: "2-5 years", value: "2-5y" },
            { label: "5+ years", value: "5y+" },
          ],
        },
        {
          id: "leaving_reason",
          type: "single_select",
          label: "Primary reason for leaving",
          required: true,
          options: [
            { label: "Better opportunity elsewhere", value: "opportunity" },
            { label: "Compensation / benefits", value: "compensation" },
            { label: "Career growth / advancement", value: "growth" },
            { label: "Work-life balance", value: "balance" },
            { label: "Management / leadership", value: "management" },
            { label: "Company culture", value: "culture" },
            { label: "Relocation", value: "relocation" },
            { label: "Personal reasons", value: "personal" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "leaving_detail",
          type: "long_text",
          label: "Can you elaborate on your reason for leaving?",
          required: false,
          placeholder: "Any additional context...",
          validation: [{ type: "maxLength", value: 1500 }],
        },
      ],
    },
    {
      id: "experience",
      title: "Your Experience",
      description: "Rate your experience across these areas",
      questions: [
        {
          id: "overall_satisfaction",
          type: "likert",
          label: "Overall job satisfaction",
          required: true,
          options: satisfactionOptions,
        },
        {
          id: "manager_satisfaction",
          type: "likert",
          label: "Satisfaction with your direct manager",
          required: true,
          options: satisfactionOptions,
        },
        {
          id: "growth_satisfaction",
          type: "likert",
          label: "Opportunities for professional growth",
          required: true,
          options: satisfactionOptions,
        },
        {
          id: "compensation_satisfaction",
          type: "likert",
          label: "Satisfaction with compensation and benefits",
          required: true,
          options: satisfactionOptions,
        },
        {
          id: "culture_satisfaction",
          type: "likert",
          label: "Company culture and values",
          required: true,
          options: satisfactionOptions,
        },
        {
          id: "worklife_satisfaction",
          type: "likert",
          label: "Work-life balance",
          required: true,
          options: satisfactionOptions,
        },
      ],
    },
    {
      id: "feedback",
      title: "Suggestions & Final Thoughts",
      questions: [
        {
          id: "best_part",
          type: "long_text",
          label: "What was the best part of working here?",
          required: false,
          placeholder: "What did you enjoy most?",
          validation: [{ type: "maxLength", value: 1500 }],
        },
        {
          id: "improvement",
          type: "long_text",
          label: "What could the company improve?",
          required: false,
          placeholder: "Be honest — your feedback is confidential",
          validation: [{ type: "maxLength", value: 1500 }],
        },
        {
          id: "recommend",
          type: "nps",
          label: "How likely are you to recommend this company as a place to work?",
          required: true,
        },
        {
          id: "return",
          type: "boolean",
          label: "Would you consider returning to the company in the future?",
          required: false,
        },
      ],
    },
  ],
};

export const exitInterviewMeta = {
  id: "exit-interview",
  name: "Exit Interview",
  description:
    "A 3-section confidential exit interview with departure reasons, Likert-scale satisfaction ratings (manager, growth, compensation, culture, work-life), NPS, and open-ended feedback.",
  category: "hr" as const,
  fieldCount: 14,
  sectionCount: 3,
  tags: ["hr", "exit-interview", "offboarding", "feedback", "likert"],
};

export const exitInterview: Template = {
  meta: exitInterviewMeta,
  schema: exitInterviewSchema,
};
