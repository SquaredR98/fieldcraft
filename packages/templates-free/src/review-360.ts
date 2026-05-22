import type { FormEngineSchema, Option } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

const performanceScale: Option[] = [
  { label: "Needs Improvement", value: 1 },
  { label: "Below Expectations", value: 2 },
  { label: "Meets Expectations", value: 3 },
  { label: "Exceeds Expectations", value: 4 },
  { label: "Outstanding", value: 5 },
];

export const review360Schema: FormEngineSchema = {
  id: "review-360",
  version: "1.0.0",
  title: "360° Performance Review",
  description:
    "Provide feedback on a colleague's performance. All responses are aggregated anonymously.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
    navigation: {
      showBack: true,
    },
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "context",
      title: "Review Context",
      questions: [
        {
          id: "reviewee_name",
          type: "short_text",
          label: "Person Being Reviewed",
          required: true,
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "relationship",
          type: "single_select",
          label: "Your relationship to this person",
          required: true,
          options: [
            { label: "Direct Manager", value: "manager" },
            { label: "Peer / Same Team", value: "peer" },
            { label: "Cross-functional Colleague", value: "cross-functional" },
            { label: "Direct Report", value: "report" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "interaction_frequency",
          type: "single_select",
          label: "How often do you work together?",
          required: true,
          options: [
            { label: "Daily", value: "daily" },
            { label: "Several times a week", value: "weekly" },
            { label: "A few times a month", value: "monthly" },
            { label: "Occasionally", value: "occasionally" },
          ],
        },
      ],
    },
    {
      id: "competencies",
      title: "Core Competencies",
      description: "Rate this person on the following competencies",
      questions: [
        {
          id: "communication",
          type: "likert",
          label: "Communication — Expresses ideas clearly, listens actively",
          required: true,
          options: performanceScale,
        },
        {
          id: "collaboration",
          type: "likert",
          label: "Collaboration — Works effectively with others, shares knowledge",
          required: true,
          options: performanceScale,
        },
        {
          id: "problem_solving",
          type: "likert",
          label: "Problem Solving — Approaches challenges analytically, finds solutions",
          required: true,
          options: performanceScale,
        },
        {
          id: "accountability",
          type: "likert",
          label: "Accountability — Delivers on commitments, takes ownership",
          required: true,
          options: performanceScale,
        },
        {
          id: "initiative",
          type: "likert",
          label: "Initiative — Proactively identifies opportunities, takes action",
          required: true,
          options: performanceScale,
        },
        {
          id: "adaptability",
          type: "likert",
          label: "Adaptability — Handles change well, adjusts approach when needed",
          required: true,
          options: performanceScale,
        },
        {
          id: "technical_skills",
          type: "likert",
          label: "Technical Skills — Demonstrates expertise in their role",
          required: true,
          options: performanceScale,
        },
        {
          id: "leadership",
          type: "likert",
          label: "Leadership — Inspires others, makes good decisions under pressure",
          required: false,
          helpText: "Skip if not applicable to this person's role",
          options: performanceScale,
        },
      ],
    },
    {
      id: "open-feedback",
      title: "Open Feedback",
      description: "Your written feedback is especially valuable",
      questions: [
        {
          id: "strengths",
          type: "long_text",
          label: "What are this person's greatest strengths?",
          required: true,
          placeholder: "What do they do well? What should they keep doing?",
          validation: [
            { type: "minLength", value: 20, message: "Please provide meaningful feedback" },
            { type: "maxLength", value: 2000 },
          ],
        },
        {
          id: "areas_for_growth",
          type: "long_text",
          label: "What areas could they improve?",
          required: true,
          placeholder: "Be constructive — focus on behaviors, not personality",
          validation: [
            { type: "minLength", value: 20, message: "Please provide meaningful feedback" },
            { type: "maxLength", value: 2000 },
          ],
        },
        {
          id: "overall_rating",
          type: "rating",
          label: "Overall performance rating",
          required: true,
        },
        {
          id: "additional_comments",
          type: "long_text",
          label: "Any additional comments?",
          required: false,
          validation: [{ type: "maxLength", value: 1000 }],
        },
      ],
    },
  ],
};

export const review360Meta = {
  id: "review-360",
  name: "360° Performance Review",
  description:
    "A 3-section 360-degree review with reviewer context, 8 Likert-scale competency ratings (communication, collaboration, problem-solving, accountability, initiative, adaptability, technical, leadership), strengths/growth areas, and overall rating.",
  category: "hr" as const,
  fieldCount: 15,
  sectionCount: 3,
  tags: ["hr", "performance-review", "360", "feedback", "likert"],
};

export const review360: Template = {
  meta: review360Meta,
  schema: review360Schema,
};
