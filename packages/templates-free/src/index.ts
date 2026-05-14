// @squaredr/fieldcraft-templates-free
// 5 free, production-ready form schemas for FieldCraft

// Types
export type { Template, TemplateMeta, TemplateCategory } from "./types";

// Individual schemas
export { contactFormSchema, contactFormMeta, contactForm } from "./contact-form";
export { feedbackSurveySchema, feedbackSurveyMeta, feedbackSurvey } from "./feedback-survey";
export { npsSurveySchema, npsSurveyMeta, npsSurvey } from "./nps-survey";
export { newsletterSignupSchema, newsletterSignupMeta, newsletterSignup } from "./newsletter-signup";
export { bugReportSchema, bugReportMeta, bugReport } from "./bug-report";

// All templates as a collection
import { contactForm } from "./contact-form";
import { feedbackSurvey } from "./feedback-survey";
import { npsSurvey } from "./nps-survey";
import { newsletterSignup } from "./newsletter-signup";
import { bugReport } from "./bug-report";

import type { Template } from "./types";

export const allTemplates: Template[] = [
  contactForm,
  feedbackSurvey,
  npsSurvey,
  newsletterSignup,
  bugReport,
];
