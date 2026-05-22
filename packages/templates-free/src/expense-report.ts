import type { FormEngineSchema } from "@squaredr/fieldcraft-core";
import type { Template } from "./types";

export const expenseReportSchema: FormEngineSchema = {
  id: "expense-report",
  version: "1.0.0",
  title: "Expense Report",
  description:
    "Submit your expense report for reimbursement. Attach receipts for expenses over $25.",
  settings: {
    showProgress: true,
    progressStyle: "steps",
    navigation: {
      showBack: true,
    },
    allowDraftSave: true,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "employee-info",
      title: "Employee Information",
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
          id: "manager",
          type: "short_text",
          label: "Approving Manager",
          required: true,
          placeholder: "Name of your direct manager",
          validation: [{ type: "maxLength", value: 100 }],
        },
        {
          id: "report_period",
          type: "single_select",
          label: "Reporting Period",
          required: true,
          options: [
            { label: "This Week", value: "this-week" },
            { label: "Last Week", value: "last-week" },
            { label: "This Month", value: "this-month" },
            { label: "Last Month", value: "last-month" },
            { label: "Custom Period", value: "custom" },
          ],
        },
      ],
    },
    {
      id: "expenses",
      title: "Expense Details",
      description: "List each expense item",
      questions: [
        {
          id: "expense_category",
          type: "single_select",
          label: "Expense Category",
          required: true,
          options: [
            { label: "Travel — Flights", value: "travel-flights" },
            { label: "Travel — Hotel", value: "travel-hotel" },
            { label: "Travel — Ground Transport", value: "travel-ground" },
            { label: "Meals & Entertainment", value: "meals" },
            { label: "Office Supplies", value: "office" },
            { label: "Software / Subscriptions", value: "software" },
            { label: "Training / Conference", value: "training" },
            { label: "Client Expenses", value: "client" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "expense_date",
          type: "date",
          label: "Expense Date",
          required: true,
        },
        {
          id: "description",
          type: "short_text",
          label: "Description",
          required: true,
          placeholder: "Brief description of the expense",
          validation: [{ type: "maxLength", value: 200 }],
        },
        {
          id: "amount",
          type: "number",
          label: "Amount ($)",
          required: true,
          config: {
            type: "number",
            min: 0.01,
            max: 50000,
            step: 0.01,
            prefix: "$",
            decimalPlaces: 2,
          },
        },
        {
          id: "currency",
          type: "dropdown",
          label: "Currency",
          required: true,
          options: [
            { label: "USD — US Dollar", value: "USD" },
            { label: "EUR — Euro", value: "EUR" },
            { label: "GBP — British Pound", value: "GBP" },
            { label: "CAD — Canadian Dollar", value: "CAD" },
            { label: "AUD — Australian Dollar", value: "AUD" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "receipt_url",
          type: "url",
          label: "Receipt Link",
          required: false,
          placeholder: "https://drive.google.com/...",
          helpText: "Required for expenses over $25. Upload to Google Drive / Dropbox and paste link.",
        },
        {
          id: "business_justification",
          type: "long_text",
          label: "Business Justification",
          required: true,
          placeholder: "Why was this expense necessary?",
          validation: [
            { type: "minLength", value: 10 },
            { type: "maxLength", value: 500 },
          ],
        },
      ],
    },
    {
      id: "summary",
      title: "Summary & Submission",
      questions: [
        {
          id: "total_amount",
          type: "short_text",
          label: "Total Amount Requested",
          required: true,
          placeholder: "$0.00",
          helpText: "Sum of all expenses in this report",
        },
        {
          id: "additional_notes",
          type: "long_text",
          label: "Additional Notes",
          required: false,
          placeholder: "Any context for the approver...",
          validation: [{ type: "maxLength", value: 500 }],
        },
        {
          id: "policy_acknowledgment",
          type: "boolean",
          label: "I confirm these expenses comply with company expense policy",
          required: true,
        },
      ],
    },
  ],
};

export const expenseReportMeta = {
  id: "expense-report",
  name: "Expense Report",
  description:
    "A 3-section expense report with employee info, detailed expense entries (category, date, amount, currency, receipt, justification), and summary with policy acknowledgment. Supports draft saving.",
  category: "hr" as const,
  fieldCount: 14,
  sectionCount: 3,
  tags: ["hr", "expense", "reimbursement", "finance", "receipts"],
};

export const expenseReport: Template = {
  meta: expenseReportMeta,
  schema: expenseReportSchema,
};
