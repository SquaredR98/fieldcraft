import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const onboardingChecklistSchema: FormEngineSchema = {
  id: "onboarding-checklist",
  version: "1.0.0",
  title: "New Employee Onboarding",
  description:
    "Welcome aboard! Complete this checklist during your first week to get set up.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
    navigation: {
      showBack: true,
    },
    allowDraftSave: true,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "personal-details",
      title: "Personal Details",
      description: "Confirm your information for our records",
      questions: [
        {
          id: "legal_name",
          type: "short_text",
          label: "Full Legal Name (as it appears on ID)",
          required: true,
          validation: [{ type: "maxLength", value: 150 }],
        },
        {
          id: "preferred_name",
          type: "short_text",
          label: "Preferred Name / Nickname",
          required: false,
          placeholder: "What should we call you?",
          validation: [{ type: "maxLength", value: 50 }],
        },
        {
          id: "personal_email",
          type: "email",
          label: "Personal Email Address",
          required: true,
          helpText: "For sending tax documents and emergency communication",
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          required: true,
        },
        {
          id: "emergency_contact_name",
          type: "short_text",
          label: "Emergency Contact Name",
          required: true,
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "emergency_contact_phone",
          type: "phone",
          label: "Emergency Contact Phone",
          required: true,
        },
        {
          id: "emergency_contact_relation",
          type: "short_text",
          label: "Relationship to Emergency Contact",
          required: true,
          placeholder: "Spouse, Parent, Sibling, etc.",
          validation: [{ type: "maxLength", value: 50 }],
        },
      ],
    },
    {
      id: "it-setup",
      title: "IT & Equipment Setup",
      description: "Confirm your tech preferences and account setup",
      questions: [
        {
          id: "laptop_preference",
          type: "single_select",
          label: "Laptop Preference",
          required: true,
          options: [
            { label: "MacBook Pro", value: "macbook" },
            { label: "Windows Laptop", value: "windows" },
            { label: "Linux Laptop", value: "linux" },
            { label: "No preference", value: "any" },
          ],
        },
        {
          id: "email_setup",
          type: "boolean",
          label: "I have received and can access my company email",
          required: true,
        },
        {
          id: "slack_joined",
          type: "boolean",
          label: "I have joined the company Slack workspace",
          required: true,
        },
        {
          id: "tools_access",
          type: "multi_select",
          label: "Which tools do you need access to?",
          required: false,
          helpText: "Select all that apply — IT will provision access",
          options: [
            { label: "GitHub / GitLab", value: "git" },
            { label: "Jira / Linear", value: "project-mgmt" },
            { label: "Figma", value: "figma" },
            { label: "AWS / Cloud Console", value: "cloud" },
            { label: "CRM (Salesforce / HubSpot)", value: "crm" },
            { label: "Analytics (Mixpanel / Amplitude)", value: "analytics" },
          ],
        },
      ],
    },
    {
      id: "hr-tasks",
      title: "HR & Compliance",
      description: "Required paperwork and acknowledgments",
      questions: [
        {
          id: "id_submitted",
          type: "boolean",
          label: "I have submitted my government-issued ID for verification",
          required: true,
        },
        {
          id: "tax_forms",
          type: "boolean",
          label: "I have completed my tax forms (W-4 / equivalent)",
          required: true,
        },
        {
          id: "direct_deposit",
          type: "boolean",
          label: "I have set up direct deposit for payroll",
          required: true,
        },
        {
          id: "handbook_read",
          type: "boolean",
          label: "I have read the employee handbook",
          required: true,
        },
        {
          id: "code_of_conduct",
          type: "boolean",
          label: "I acknowledge and agree to the company code of conduct",
          required: true,
        },
        {
          id: "questions",
          type: "long_text",
          label: "Questions or concerns?",
          required: false,
          placeholder: "Anything you'd like to ask your manager or HR...",
          validation: [{ type: "maxLength", value: 1000 }],
        },
      ],
    },
  ],
};

export const onboardingChecklistMeta = {
  id: "onboarding-checklist",
  name: "Onboarding Checklist",
  description:
    "A 3-section new employee onboarding form covering personal details, IT/equipment setup, and HR compliance tasks. Includes emergency contacts, tool access requests, and policy acknowledgments.",
  category: "hr" as const,
  fieldCount: 17,
  sectionCount: 3,
  tags: ["hr", "onboarding", "new-hire", "checklist"],
};

export const onboardingChecklist: Template = {
  meta: onboardingChecklistMeta,
  schema: onboardingChecklistSchema,
};
