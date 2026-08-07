import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const jobApplicationDemo: FormEngineSchema = {
  id: "job-application-demo",
  version: "1.0.0",
  title: "Job Application Form",
  description: "A real-world multi-step job application with file uploads, conditional sections, and structured data collection.",
  settings: {
    showProgress: true,
    progressStyle: "bar",
    allowDraftSave: true,
    draftTtlHours: 168,
  },
  sections: [
    {
      id: "personal",
      title: "Personal Information",
      questions: [
        {
          id: "applicant_name",
          type: "legal_name",
          label: "Full Legal Name",
          required: true,
        },
        {
          id: "applicant_email",
          type: "email",
          label: "Email Address",
          required: true,
        },
        {
          id: "applicant_phone",
          type: "phone",
          label: "Phone Number",
          required: true,
        },
        {
          id: "applicant_location",
          type: "country_select",
          label: "Country",
          required: true,
        },
        {
          id: "applicant_website",
          type: "url",
          label: "Portfolio / LinkedIn URL",
          required: false,
          helpText: "Link to your portfolio, LinkedIn, or personal website",
        },
      ],
    },
    {
      id: "position",
      title: "Position Details",
      questions: [
        {
          id: "role",
          type: "dropdown",
          label: "Position Applied For",
          required: true,
          options: [
            { label: "Frontend Engineer", value: "frontend" },
            { label: "Backend Engineer", value: "backend" },
            { label: "Full Stack Engineer", value: "fullstack" },
            { label: "DevOps Engineer", value: "devops" },
            { label: "Design Engineer", value: "design" },
            { label: "Product Manager", value: "pm" },
          ],
        },
        {
          id: "experience_years",
          type: "number",
          label: "Years of Professional Experience",
          required: true,
          validation: [
            { type: "min", value: 0 },
            { type: "max", value: 40 },
          ],
        },
        {
          id: "tech_stack",
          type: "multi_select",
          label: "Technologies You're Proficient In",
          required: true,
          helpText: "Select all that apply",
          options: [
            { label: "React", value: "react" },
            { label: "TypeScript", value: "typescript" },
            { label: "Node.js", value: "nodejs" },
            { label: "Python", value: "python" },
            { label: "Go", value: "go" },
            { label: "PostgreSQL", value: "postgres" },
            { label: "AWS", value: "aws" },
            { label: "Docker / Kubernetes", value: "docker" },
          ],
        },
        {
          id: "salary_expectation",
          type: "slider",
          label: "Salary Expectation (USD/year)",
          required: false,
          helpText: "Approximate range is fine",
          validation: [
            { type: "min", value: 30000 },
            { type: "max", value: 300000 },
          ],
        },
        {
          id: "start_date",
          type: "date",
          label: "Earliest Start Date",
          required: true,
        },
        {
          id: "remote_preference",
          type: "single_select",
          label: "Work Arrangement Preference",
          required: true,
          options: [
            { label: "Fully Remote", value: "remote" },
            { label: "Hybrid", value: "hybrid" },
            { label: "On-site", value: "onsite" },
            { label: "No preference", value: "any" },
          ],
        },
      ],
    },
    {
      id: "attachments",
      title: "Documents",
      questions: [
        {
          id: "resume",
          type: "file_upload",
          label: "Resume / CV",
          required: true,
          helpText: "PDF or DOCX format, max 5MB",
        },
        {
          id: "cover_letter",
          type: "long_text",
          label: "Cover Letter",
          required: false,
          helpText: "Tell us why you're interested in this role",
          validation: [{ type: "maxLength", value: 2000 }],
        },
      ],
    },
    {
      id: "final",
      title: "Final Questions",
      questions: [
        {
          id: "referral_source",
          type: "dropdown",
          label: "How did you hear about us?",
          required: false,
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "Company website", value: "website" },
            { label: "Referral from friend", value: "referral" },
            { label: "Job board", value: "job_board" },
            { label: "GitHub", value: "github" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "additional_notes",
          type: "long_text",
          label: "Anything else you'd like us to know?",
          required: false,
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "data_consent",
          type: "consent",
          label: "I consent to the processing of my personal data for recruitment purposes",
          required: true,
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
