import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const eventRegistrationSchema: FormEngineSchema = {
  id: "event-registration",
  version: "1.0.0",
  title: "Event Registration",
  description: "Register for the event. Secure your spot today.",
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
      id: "attendee-info",
      title: "Attendee Information",
      description: "Tell us about yourself",
      questions: [
        {
          id: "first_name",
          type: "short_text",
          label: "First Name",
          required: true,
          placeholder: "Jane",
          validation: [
            { type: "minLength", value: 2, message: "Name is too short" },
            { type: "maxLength", value: 50 },
          ],
        },
        {
          id: "last_name",
          type: "short_text",
          label: "Last Name",
          required: true,
          placeholder: "Doe",
          validation: [
            { type: "minLength", value: 2 },
            { type: "maxLength", value: 50 },
          ],
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
          placeholder: "you@company.com",
          helpText: "Confirmation and event details will be sent here",
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          required: false,
          placeholder: "(555) 123-4567",
        },
        {
          id: "organization",
          type: "short_text",
          label: "Company / Organization",
          required: false,
          placeholder: "Acme Corp",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "job_title",
          type: "short_text",
          label: "Job Title",
          required: false,
          placeholder: "Product Manager",
          validation: [{ type: "maxLength", value: 100 }],
        },
      ],
    },
    {
      id: "event-details",
      title: "Event Preferences",
      description: "Help us plan the best experience for you",
      questions: [
        {
          id: "ticket_type",
          type: "single_select",
          label: "Ticket Type",
          required: true,
          options: [
            { label: "General Admission", value: "general" },
            { label: "VIP", value: "vip" },
            { label: "Student", value: "student" },
            { label: "Group (5+)", value: "group" },
          ],
        },
        {
          id: "sessions",
          type: "multi_select",
          label: "Which sessions are you interested in?",
          required: false,
          helpText: "Select all that apply",
          options: [
            { label: "Opening Keynote", value: "keynote" },
            { label: "Workshop: Getting Started", value: "workshop-beginner" },
            { label: "Workshop: Advanced Topics", value: "workshop-advanced" },
            { label: "Panel Discussion", value: "panel" },
            { label: "Networking Mixer", value: "networking" },
          ],
        },
        {
          id: "dietary_requirements",
          type: "single_select",
          label: "Dietary Requirements",
          required: false,
          helpText: "For catered meals and snacks",
          options: [
            { label: "None", value: "none" },
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Vegan", value: "vegan" },
            { label: "Gluten-Free", value: "gluten-free" },
            { label: "Kosher", value: "kosher" },
            { label: "Halal", value: "halal" },
            { label: "Other (specify in comments)", value: "other" },
          ],
        },
        {
          id: "tshirt_size",
          type: "dropdown",
          label: "T-Shirt Size",
          required: false,
          helpText: "All attendees receive a free event t-shirt",
          options: [
            { label: "XS", value: "xs" },
            { label: "S", value: "s" },
            { label: "M", value: "m" },
            { label: "L", value: "l" },
            { label: "XL", value: "xl" },
            { label: "XXL", value: "xxl" },
          ],
        },
      ],
    },
    {
      id: "additional",
      title: "Additional Information",
      description: "Anything else we should know?",
      questions: [
        {
          id: "accessibility_needs",
          type: "long_text",
          label: "Accessibility Requirements",
          required: false,
          placeholder: "Wheelchair access, sign language interpreter, etc.",
          helpText: "We want to make sure everyone has a great experience",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "how_heard",
          type: "single_select",
          label: "How did you hear about this event?",
          required: false,
          options: [
            { label: "Social Media", value: "social" },
            { label: "Email", value: "email" },
            { label: "Word of Mouth", value: "word-of-mouth" },
            { label: "Company Website", value: "website" },
            { label: "Search Engine", value: "search" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "comments",
          type: "long_text",
          label: "Comments or Questions",
          required: false,
          placeholder: "Anything else you'd like us to know...",
          validation: [{ type: "maxLength", value: 1000 }],
        },
        {
          id: "consent_photos",
          type: "boolean",
          label: "I consent to being photographed/recorded during the event",
          required: false,
        },
        {
          id: "consent_updates",
          type: "boolean",
          label: "Send me updates about future events",
          required: false,
        },
      ],
    },
  ],
};

export const eventRegistrationMeta = {
  id: "event-registration",
  name: "Event Registration",
  description:
    "A comprehensive 3-section event registration form with attendee details, session preferences, dietary requirements, t-shirt sizing, accessibility needs, and marketing consent.",
  category: "general" as const,
  fieldCount: 15,
  sectionCount: 3,
  tags: ["event", "registration", "conference", "multi-step"],
};

export const eventRegistration: Template = {
  meta: eventRegistrationMeta,
  schema: eventRegistrationSchema,
};
