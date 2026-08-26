import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const bugReportSchema: FormEngineSchema = {
  id: "bug-report",
  version: "1.0.0",
  title: "Bug Report",
  description: "Report a bug so we can fix it. The more detail, the faster we can help.",
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
      id: "reporter",
      title: "Your Details",
      description: "So we can follow up if we need more info",
      questions: [
        {
          id: "name",
          type: "short_text",
          label: "Name",
          required: true,
          placeholder: "Jane Doe",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          required: true,
          placeholder: "you@company.com",
        },
      ],
    },
    {
      id: "bug-details",
      title: "Bug Details",
      description: "Describe what went wrong",
      questions: [
        {
          id: "title",
          type: "short_text",
          label: "Bug Title",
          required: true,
          placeholder: "Brief description of the issue",
          validation: [
            { type: "minLength", value: 5, message: "Please be more specific" },
            { type: "maxLength", value: 200 },
          ],
        },
        {
          id: "severity",
          type: "dropdown",
          label: "Severity",
          required: true,
          options: [
            { label: "Critical — app is unusable", value: "critical" },
            { label: "High — major feature broken", value: "high" },
            { label: "Medium — feature works but incorrectly", value: "medium" },
            { label: "Low — cosmetic or minor issue", value: "low" },
          ],
        },
        {
          id: "steps_to_reproduce",
          type: "long_text",
          label: "Steps to Reproduce",
          required: true,
          placeholder:
            "1. Go to...\n2. Click on...\n3. Observe that...",
          helpText: "Step-by-step instructions to reproduce the bug",
          validation: [
            {
              type: "minLength",
              value: 20,
              message: "Please provide detailed steps",
            },
            { type: "maxLength", value: 3000 },
          ],
        },
        {
          id: "expected_behavior",
          type: "long_text",
          label: "Expected Behavior",
          required: true,
          placeholder: "What should have happened...",
          validation: [{ type: "maxLength", value: 1000 }],
        },
        {
          id: "browser_os",
          type: "single_select",
          label: "Browser / Environment",
          required: false,
          options: [
            { label: "Chrome", value: "chrome" },
            { label: "Firefox", value: "firefox" },
            { label: "Safari", value: "safari" },
            { label: "Edge", value: "edge" },
            { label: "Mobile (iOS)", value: "ios" },
            { label: "Mobile (Android)", value: "android" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "screenshot_url",
          type: "url",
          label: "Screenshot / Recording URL",
          required: false,
          placeholder: "https://...",
          helpText: "Link to a screenshot or screen recording (Loom, CloudApp, etc.)",
        },
      ],
    },
  ],
};

export const bugReportMeta = {
  id: "bug-report",
  name: "Bug Report",
  description:
    "A structured bug report form with reporter details, severity classification, reproduction steps, expected behavior, environment selection, and screenshot URL. Two sections with step-based progress.",
  category: "support" as const,
  fieldCount: 8,
  sectionCount: 2,
  tags: ["bug", "report", "support", "issue-tracking"],
};

export const bugReport: Template = {
  meta: bugReportMeta,
  schema: bugReportSchema,
};
