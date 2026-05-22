// @squaredr/fieldcraft-templates-free
// 16 free, production-ready form schemas for FieldCraft

// Types
export type { Template, TemplateMeta, TemplateCategory } from "./types";

// ── Original templates ───────────────────────────────────────────────
export { contactFormSchema, contactFormMeta, contactForm } from "./contact-form";
export { feedbackSurveySchema, feedbackSurveyMeta, feedbackSurvey } from "./feedback-survey";
export { npsSurveySchema, npsSurveyMeta, npsSurvey } from "./nps-survey";
export { newsletterSignupSchema, newsletterSignupMeta, newsletterSignup } from "./newsletter-signup";
export { bugReportSchema, bugReportMeta, bugReport } from "./bug-report";

// ── General templates ────────────────────────────────────────────────
export {
  eventRegistrationSchema,
  eventRegistrationMeta,
  eventRegistration,
} from "./event-registration";
export {
  leadGenerationSchema,
  leadGenerationMeta,
  leadGeneration,
} from "./lead-generation";
export {
  featureRequestSchema,
  featureRequestMeta,
  featureRequest,
} from "./feature-request";
export { pollSchema, pollMeta, poll } from "./poll";
export { quizSchema, quizMeta, quiz } from "./quiz";

// ── HR templates ─────────────────────────────────────────────────────
export {
  jobApplicationSchema,
  jobApplicationMeta,
  jobApplication,
} from "./job-application";
export {
  onboardingChecklistSchema,
  onboardingChecklistMeta,
  onboardingChecklist,
} from "./onboarding-checklist";
export {
  exitInterviewSchema,
  exitInterviewMeta,
  exitInterview,
} from "./exit-interview";
export { review360Schema, review360Meta, review360 } from "./review-360";
export {
  timeOffRequestSchema,
  timeOffRequestMeta,
  timeOffRequest,
} from "./time-off-request";
export {
  expenseReportSchema,
  expenseReportMeta,
  expenseReport,
} from "./expense-report";

// ── All templates as a collection ────────────────────────────────────
import { contactForm } from "./contact-form";
import { feedbackSurvey } from "./feedback-survey";
import { npsSurvey } from "./nps-survey";
import { newsletterSignup } from "./newsletter-signup";
import { bugReport } from "./bug-report";
import { eventRegistration } from "./event-registration";
import { leadGeneration } from "./lead-generation";
import { featureRequest } from "./feature-request";
import { poll } from "./poll";
import { quiz } from "./quiz";
import { jobApplication } from "./job-application";
import { onboardingChecklist } from "./onboarding-checklist";
import { exitInterview } from "./exit-interview";
import { review360 } from "./review-360";
import { timeOffRequest } from "./time-off-request";
import { expenseReport } from "./expense-report";

import type { Template } from "./types";

export const allTemplates: Template[] = [
  // Original
  contactForm,
  feedbackSurvey,
  npsSurvey,
  newsletterSignup,
  bugReport,
  // General
  eventRegistration,
  leadGeneration,
  featureRequest,
  poll,
  quiz,
  // HR
  jobApplication,
  onboardingChecklist,
  exitInterview,
  review360,
  timeOffRequest,
  expenseReport,
];
