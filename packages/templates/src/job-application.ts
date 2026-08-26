import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const jobApplicationSchema: FormEngineSchema = {
  id: "job-application",
  version: "1.0.0",
  title: "Job Application",
  description: "Apply for a position with us. We review every application.",
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
      id: "personal-info",
      title: "Personal Information",
      questions: [
        {
          id: "first_name",
          type: "short_text",
          label: "First Name",
          required: true,
          placeholder: "Jane",
          validation: [{ type: "maxLength", value: 50 }],
        },
        {
          id: "last_name",
          type: "short_text",
          label: "Last Name",
          required: true,
          placeholder: "Doe",
          validation: [{ type: "maxLength", value: 50 }],
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "jane@example.com",
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          required: true,
          placeholder: "(555) 123-4567",
        },
        {
          id: "location",
          type: "short_text",
          label: "Current Location (City, State/Country)",
          required: true,
          placeholder: "San Francisco, CA",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "linkedin",
          type: "url",
          label: "LinkedIn Profile",
          required: false,
          placeholder: "https://linkedin.com/in/janedoe",
        },
        {
          id: "portfolio",
          type: "url",
          label: "Portfolio / Website",
          required: false,
          placeholder: "https://janedoe.com",
        },
      ],
    },
    {
      id: "position",
      title: "Position Details",
      questions: [
        {
          id: "position_applied",
          type: "dropdown",
          label: "Position Applied For",
          required: true,
          options: [
            { label: "Software Engineer", value: "software-engineer" },
            { label: "Senior Software Engineer", value: "senior-engineer" },
            { label: "Product Manager", value: "product-manager" },
            { label: "Designer", value: "designer" },
            { label: "Data Analyst", value: "data-analyst" },
            { label: "Marketing Specialist", value: "marketing" },
            { label: "Customer Success", value: "customer-success" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "employment_type",
          type: "single_select",
          label: "Preferred Employment Type",
          required: true,
          options: [
            { label: "Full-time", value: "full-time" },
            { label: "Part-time", value: "part-time" },
            { label: "Contract", value: "contract" },
            { label: "Internship", value: "internship" },
          ],
        },
        {
          id: "start_date",
          type: "date",
          label: "Earliest Start Date",
          required: true,
        },
        {
          id: "salary_expectation",
          type: "short_text",
          label: "Salary Expectation (Annual)",
          required: false,
          placeholder: "$80,000 - $100,000",
          helpText: "Optional — helps us ensure alignment",
        },
        {
          id: "remote_preference",
          type: "single_select",
          label: "Work Location Preference",
          required: true,
          options: [
            { label: "Remote", value: "remote" },
            { label: "Hybrid", value: "hybrid" },
            { label: "On-site", value: "onsite" },
            { label: "No preference", value: "any" },
          ],
        },
      ],
    },
    {
      id: "experience",
      title: "Experience & Qualifications",
      questions: [
        {
          id: "years_experience",
          type: "single_select",
          label: "Years of Relevant Experience",
          required: true,
          options: [
            { label: "Less than 1 year", value: "0-1" },
            { label: "1-3 years", value: "1-3" },
            { label: "3-5 years", value: "3-5" },
            { label: "5-10 years", value: "5-10" },
            { label: "10+ years", value: "10+" },
          ],
        },
        {
          id: "education",
          type: "single_select",
          label: "Highest Education Level",
          required: false,
          options: [
            { label: "High School / GED", value: "high-school" },
            { label: "Associate's Degree", value: "associates" },
            { label: "Bachelor's Degree", value: "bachelors" },
            { label: "Master's Degree", value: "masters" },
            { label: "Doctorate", value: "doctorate" },
            { label: "Self-taught / Bootcamp", value: "self-taught" },
          ],
        },
        {
          id: "cover_letter",
          type: "long_text",
          label: "Cover Letter / Why This Role?",
          required: true,
          placeholder: "Tell us why you're interested in this role and what makes you a great fit...",
          validation: [
            { type: "minLength", value: 100, message: "Please write at least a few sentences" },
            { type: "maxLength", value: 5000 },
          ],
        },
        {
          id: "resume_url",
          type: "url",
          label: "Resume / CV Link",
          required: false,
          placeholder: "https://drive.google.com/...",
          helpText: "Link to your resume (Google Drive, Dropbox, etc.)",
        },
        {
          id: "referral",
          type: "short_text",
          label: "Referred By",
          required: false,
          placeholder: "Name of employee who referred you",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "consent",
          type: "boolean",
          label: "I confirm that the information provided is accurate and I consent to my data being processed for recruitment purposes",
          required: true,
        },
      ],
    },
  ],
};

export const jobApplicationMeta = {
  id: "job-application",
  name: "Job Application",
  description:
    "A comprehensive 3-section job application form with personal info, position preferences (role, type, salary, remote), experience details, cover letter, and consent.",
  category: "hr" as const,
  fieldCount: 18,
  sectionCount: 3,
  tags: ["hr", "job-application", "recruiting", "hiring"],
};

export const jobApplication: Template = {
  meta: jobApplicationMeta,
  schema: jobApplicationSchema,
};
