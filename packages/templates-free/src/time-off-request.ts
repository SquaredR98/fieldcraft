import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const timeOffRequestSchema: FormEngineSchema = {
  id: "time-off-request",
  version: "1.0.0",
  title: "Time Off Request",
  description: "Submit your time-off request for manager approval.",
  settings: {
    showProgress: false,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "request",
      title: "Request Details",
      questions: [
        {
          id: "employee_name",
          type: "short_text",
          label: "Employee Name",
          required: true,
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "department",
          type: "short_text",
          label: "Department",
          required: true,
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "leave_type",
          type: "single_select",
          label: "Type of Leave",
          required: true,
          options: [
            { label: "Vacation / PTO", value: "vacation" },
            { label: "Sick Leave", value: "sick" },
            { label: "Personal Day", value: "personal" },
            { label: "Bereavement", value: "bereavement" },
            { label: "Jury Duty", value: "jury-duty" },
            { label: "Parental Leave", value: "parental" },
            { label: "Unpaid Leave", value: "unpaid" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "start_date",
          type: "date",
          label: "Start Date",
          required: true,
        },
        {
          id: "end_date",
          type: "date",
          label: "End Date",
          required: true,
        },
        {
          id: "half_day",
          type: "boolean",
          label: "Half-day request (first or last day only)",
          required: false,
        },
        {
          id: "reason",
          type: "long_text",
          label: "Reason (optional)",
          required: false,
          placeholder: "Brief reason for leave — not required for vacation/PTO",
          showIf: {
            field: "leave_type",
            operator: "neq",
            value: "vacation",
          },
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "coverage",
          type: "short_text",
          label: "Coverage Plan",
          required: false,
          placeholder: "Who will cover your responsibilities?",
          helpText: "Name of colleague or team handling your work",
          validation: [{ type: "maxLength", value: 200 }],
        },
        {
          id: "notes",
          type: "long_text",
          label: "Additional Notes for Manager",
          required: false,
          validation: [{ type: "maxLength", value: 500 }],
        },
      ],
    },
  ],
};

export const timeOffRequestMeta = {
  id: "time-off-request",
  name: "Time Off Request",
  description:
    "A single-section time-off request with leave type, date range, half-day option, conditional reason field, coverage plan, and manager notes.",
  category: "hr" as const,
  fieldCount: 9,
  sectionCount: 1,
  tags: ["hr", "time-off", "leave", "pto", "request"],
};

export const timeOffRequest: Template = {
  meta: timeOffRequestMeta,
  schema: timeOffRequestSchema,
};
