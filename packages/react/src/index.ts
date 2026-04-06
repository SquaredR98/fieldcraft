// @squaredr/formengine-react
// React renderer for FormEngine — hooks, components, theming, field registry

// ---- Hooks ----
export { useFormEngine, type UseFormEngineReturn } from "./hooks/useFormEngine";
export { useFieldValue } from "./hooks/useFieldValue";
export { useFieldError } from "./hooks/useFieldError";
export { useSectionProgress, type SectionProgress } from "./hooks/useSectionProgress";

// ---- Theme ----
export { FormEngineThemeProvider, useTheme } from "./theme/ThemeProvider";
export { themeToCssVars } from "./theme/theme-to-css-vars";

// Theme presets
export { cleanPreset } from "./theme/presets/clean";
export { modernPreset } from "./theme/presets/modern";
export { darkPreset } from "./theme/presets/dark";
export { highContrastPreset } from "./theme/presets/high-contrast";
export { clinicalPreset } from "./theme/presets/clinical";
export { playfulPreset } from "./theme/presets/playful";

// ---- Registry ----
export {
  type FieldProps,
  type FieldComponent,
  type FieldRegistry,
  createFieldRegistry,
  mergeRegistries,
} from "./registry/field-registry";
export { defaultRegistry } from "./registry/default-registry";

// ---- Core Components ----
export { FormEngineRenderer, type FormEngineRendererProps } from "./components/FormEngineRenderer";
export { SectionRenderer, type SectionRendererProps } from "./components/SectionRenderer";
export { FieldRenderer, type FieldRendererProps } from "./components/FieldRenderer";
export { ProgressBar, type ProgressBarProps } from "./components/ProgressBar";
export { NavigationButtons, type NavigationButtonsProps } from "./components/NavigationButtons";
export { SectionNavigation, type SectionNavigationProps } from "./components/SectionNavigation";
export { ErrorSummary, type ErrorSummaryProps } from "./components/ErrorSummary";
export { DraftResumePrompt, type DraftResumePromptProps } from "./components/DraftResumePrompt";
export { CompletionScreen, type CompletionScreenProps } from "./components/CompletionScreen";

// ---- Field Components ----
// Text
export { ShortTextField } from "./components/fields/ShortTextField";
export { LongTextField } from "./components/fields/LongTextField";
export { EmailField } from "./components/fields/EmailField";
export { PhoneField } from "./components/fields/PhoneField";
export { PhoneInternationalField } from "./components/fields/PhoneInternationalField";
export { UrlField } from "./components/fields/UrlField";
export { LegalNameField } from "./components/fields/LegalNameField";

// Numeric
export { NumberField } from "./components/fields/NumberField";
export { SliderField } from "./components/fields/SliderField";
export { RatingField } from "./components/fields/RatingField";
export { NpsField } from "./components/fields/NpsField";
export { LikertField } from "./components/fields/LikertField";
export { OpinionScaleField } from "./components/fields/OpinionScaleField";

// Selection
export { SingleSelectField } from "./components/fields/SingleSelectField";
export { MultiSelectField } from "./components/fields/MultiSelectField";
export { DropdownField } from "./components/fields/DropdownField";
export { BooleanField } from "./components/fields/BooleanField";
export { CountrySelectField } from "./components/fields/CountrySelectField";
export { RankingField } from "./components/fields/RankingField";

// Date/Time
export { DateField } from "./components/fields/DateField";
export { DateRangeField } from "./components/fields/DateRangeField";
export { TimeField } from "./components/fields/TimeField";
export { AppointmentField } from "./components/fields/AppointmentField";

// Media
export { FileUploadField } from "./components/fields/FileUploadField";
export { SignatureField } from "./components/fields/SignatureField";
export { ImageCaptureField } from "./components/fields/ImageCaptureField";

// Advanced
export { AddressField } from "./components/fields/AddressField";
export { PaymentField } from "./components/fields/PaymentField";
export { MatrixField } from "./components/fields/MatrixField";
export { RepeaterField } from "./components/fields/RepeaterField";
export { CalculatedField } from "./components/fields/CalculatedField";
export { HiddenField } from "./components/fields/HiddenField";
export { ScoringField } from "./components/fields/ScoringField";

// Structural
export { ConsentField } from "./components/fields/ConsentField";
export { InfoBlockField } from "./components/fields/InfoBlockField";

// ---- Shared ----
export { FieldWrapper, fieldAria } from "./components/fields/FieldWrapper";

// ---- Utils ----
export { cn } from "./utils/cn";
export { formatPhone, formatCurrency, formatFileSize, truncate } from "./utils/format-helpers";
