import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const datetimeMediaDemo: FormEngineSchema = {
  id: "datetime-media-demo",
  version: "1.0.0",
  title: "Date, Time & Media Fields",
  description: "Demonstrates date/time fields (date, date range, time, appointment) and media fields (file upload, signature, image capture).",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
  },
  sections: [
    {
      id: "date-time",
      title: "Date & Time Fields",
      questions: [
        {
          id: "date_example",
          type: "date",
          label: "Date of Birth",
          required: true,
          helpText: "Standard date picker",
        },
        {
          id: "date_range_example",
          type: "date_range",
          label: "Vacation Period",
          required: false,
          helpText: "Select a start and end date",
        },
        {
          id: "time_example",
          type: "time",
          label: "Preferred Contact Time",
          required: false,
          helpText: "Time picker",
        },
        {
          id: "appointment_example",
          type: "appointment",
          label: "Schedule a Call",
          required: false,
          helpText: "Combined date + time appointment picker",
        },
      ],
    },
    {
      id: "media",
      title: "Media & Upload Fields",
      questions: [
        {
          id: "file_upload_example",
          type: "file_upload",
          label: "Upload Resume",
          required: false,
          helpText: "Drag and drop or click to upload (PDF, DOC, DOCX)",
        },
        {
          id: "signature_example",
          type: "signature",
          label: "Your Signature",
          required: false,
          helpText: "Draw your signature using mouse or touch",
        },
        {
          id: "image_capture_example",
          type: "image_capture",
          label: "Photo ID",
          required: false,
          helpText: "Capture image from camera or upload",
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
