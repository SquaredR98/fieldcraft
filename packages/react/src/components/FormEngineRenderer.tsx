import { useCallback, useEffect, useState } from "react";
import type {
  FormEngineSchema,
  FormEngineTheme,
  SubmitAdapter,
  FormResponse,
  FormState,
  CustomValidator,
  AsyncValidator,
  FormEngine,
  AnalyticsAdapter,
  DraftAdapter,
  DraftSnapshot,
  FieldCraftEvent,
  SubmitErrorDetail,
} from "@squaredr/fieldcraft-core";
import { useFormEngine } from "../hooks/useFormEngine";
import { FormEngineThemeProvider, useTheme } from "../theme/ThemeProvider";
import { defaultRegistry } from "../registry/default-registry";
import { mergeRegistries, type FieldRegistry } from "../registry/field-registry";
import { SectionRenderer } from "./SectionRenderer";
import { ProgressBar } from "./ProgressBar";
import { NavigationButtons } from "./NavigationButtons";
import { ErrorSummary } from "./ErrorSummary";
import { SubmitErrorNotice } from "./SubmitErrorNotice";
import { CompletionScreen } from "./CompletionScreen";
import { DraftResumePrompt } from "./DraftResumePrompt";
import { FormErrorBoundary } from "./FormErrorBoundary";
import { FieldRegistryProvider } from "../registry/FieldRegistryContext";
import { ClassicModeRenderer } from "./ClassicModeRenderer";
import { ConversationalRenderer } from "./conversational/ConversationalRenderer";
import { cn } from "../utils/cn";

export type FormEngineRendererProps = {
  schema: FormEngineSchema;

  // Submission
  adapters?: SubmitAdapter | SubmitAdapter[];
  onSubmit?: (response: FormResponse) => void | Promise<void>;

  // Theme
  theme?: FormEngineTheme;
  className?: string;

  // Components
  components?: FieldRegistry;

  // Pre-fill
  prefill?: Record<string, unknown>;
  initialValues?: Record<string, unknown>;

  // Callbacks
  onSectionChange?: (sectionId: string, index: number) => void;
  onFieldChange?: (fieldId: string, value: unknown) => void;
  onReady?: (engine: FormEngine) => void;
  onValidationError?: (errors: Record<string, string[]>) => void;
  /**
   * Called when a submission fails for a reason the respondent cannot fix —
   * a delivery failure, or a `beforeSubmit` hook that returned `false`.
   * Validation failures go to `onValidationError` instead.
   *
   * Return `false` to suppress the built-in message and present your own,
   * mirroring the `beforeSubmit` convention. Returning nothing logs/handles
   * the error while keeping the default message, which is the common case.
   */
  onSubmitError?: (detail: SubmitErrorDetail) => void | false;
  /**
   * Overrides the built-in delivery-failure message. Provided for translation;
   * it must stay safe to show a respondent, so never pass raw adapter text.
   */
  submitErrorLabel?: string;
  onStateChange?: (state: FormState) => void;

  // Draft
  sessionToken?: string;
  draftAdapter?: DraftAdapter;
  autoSaveIntervalMs?: number;
  draftMigrations?: Record<string, (draft: DraftSnapshot) => DraftSnapshot>;

  // Submission hooks & analytics
  beforeSubmit?: (response: FormResponse) => FormResponse | false | Promise<FormResponse | false>;
  analytics?: AnalyticsAdapter;
  onEvent?: (event: FieldCraftEvent) => void;
  metadata?: Record<string, unknown>;

  // Custom validators
  validators?: Record<string, CustomValidator>;
  asyncValidators?: Record<string, AsyncValidator>;

  // Labels
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;

  // Accessibility
  autoFocus?: boolean;

  // Conversational mode
  autoAdvance?: boolean;

  /** When true, built-in navigation buttons are hidden. Use `onReady` to get
   *  the engine instance, then call `engine.nextSection()`,
   *  `engine.prevSection()`, `engine.submit()` from your own UI.
   *  Pair with `onStateChange` to read `canGoNext`, `canGoPrev`,
   *  `isSubmitting`, `currentSectionIndex`, `totalVisibleSections`, etc. */
  hideNavigation?: boolean;
};

export function FormEngineRenderer({
  schema,
  adapters,
  onSubmit,
  theme,
  className,
  components,
  prefill,
  initialValues,
  onSectionChange,
  onFieldChange,
  onReady,
  onValidationError,
  onSubmitError,
  submitErrorLabel,
  onStateChange,
  sessionToken,
  draftAdapter,
  autoSaveIntervalMs,
  draftMigrations,
  beforeSubmit,
  analytics,
  onEvent,
  metadata,
  validators,
  asyncValidators,
  prevLabel,
  nextLabel,
  submitLabel,
  autoFocus,
  autoAdvance,
  hideNavigation,
}: FormEngineRendererProps) {
  const engine = useFormEngine(schema, {
    adapters,
    onSubmit,
    prefillValues: prefill,
    initialValues,
    onSectionChange,
    onFieldChange,
    onStateChange,
    validators,
    asyncValidators,
    sessionToken,
    draftAdapter,
    autoSaveIntervalMs,
    draftMigrations,
    beforeSubmit,
    analytics,
    onEvent,
    metadata,
  });

  const { state } = engine;
  const displayMode = schema.settings?.displayMode ?? "stepped";

  // Notify parent when engine is ready
  useEffect(() => {
    onReady?.(engine);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Draft detection
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  useEffect(() => {
    if (state.hasDraft) setShowDraftPrompt(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const registry = mergeRegistries(defaultRegistry, components);

  /**
   * Set when a submission fails for a reason the respondent cannot fix, and
   * the consumer did not take over by returning `false`. Drives the fallback
   * message — deliberately a fixed string, never `state.submitError`, which
   * carries raw adapter text (hostnames, ports) that must not reach a
   * respondent.
   */
  const [showSubmitError, setShowSubmitError] = useState(false);

  const handleSubmit = useCallback(async () => {
    setShowSubmitError(false);

    const result = await engine.submit();
    if (result.success) return;

    // A failure is only the respondent's to fix if validation found something.
    const validation = engine.validate();
    if (!validation.valid) {
      onValidationError?.(validation.errors);
      return;
    }

    // Input was fine, so the submission itself failed. A `beforeSubmit` hook
    // returning false is a deliberate stop rather than an error, so it is
    // reported but never shown as a failure to the respondent.
    const cancelled = result.adapterResults.some(
      (r) => !r.success && r.adapterName === "beforeSubmit",
    );
    const detail: SubmitErrorDetail = {
      kind: cancelled ? "cancelled" : "delivery",
      message: result.adapterResults
        .filter((r) => !r.success)
        .map((r) => r.error)
        .filter(Boolean)
        .join("; "),
      adapterResults: result.adapterResults,
      // `SubmitResult` carries no response, and the engine builds it with
      // values this component does not hold (sessionToken, completionTimeMs,
      // merged metadata). Omitted rather than reconstructed inaccurately.
      // `CORE-16` threads the real one through.
    };

    const handled = onSubmitError?.(detail);
    if (handled === false) return;
    if (detail.kind === "delivery") setShowSubmitError(true);
  }, [engine, onValidationError, onSubmitError]);

  /**
   * One rule for all three display modes: a form submit event means "the user
   * is done with what is in front of them". The engine decides whether that
   * means advance or finish.
   *
   * Classic is the degenerate case — there is nothing to advance to, so it is
   * always at the end and submit always submits.
   *
   * No validation lives here. `engine.nextSection()` already validates the
   * current section and refuses to advance when it fails (state-manager.ts:215),
   * and `engine.submit()` already validates everything. The renderer's job is
   * only to ask the right one.
   */
  const atEnd =
    displayMode === "classic"
      ? true
      : displayMode === "stepped"
        ? state.currentSectionIndex === state.totalVisibleSections - 1
        : !state.canGoNextQuestion;

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // Always: the engine owns submission, never the browser.
      e.preventDefault();

      if (!atEnd) {
        if (displayMode === "stepped") engine.nextSection();
        else engine.nextQuestion();
        return;
      }

      void handleSubmit();
    },
    [atEnd, displayMode, engine, handleSubmit],
  );

  const handleResumeDraft = useCallback(async () => {
    await engine.loadDraft();
    setShowDraftPrompt(false);
  }, [engine]);

  const handleDiscardDraft = useCallback(() => {
    engine.clearDraft();
    setShowDraftPrompt(false);
  }, [engine]);

  // Build field labels map for error summary
  const fieldLabels: Record<string, string> = {};
  for (const section of schema.sections) {
    for (const q of section.questions) {
      fieldLabels[q.id] = q.label;
    }
  }

  // Completed state
  if (state.isSubmitted) {
    return (
      <FormEngineThemeProvider theme={theme}>
        <div className={cn("flex flex-col gap-8", className)}>
          <CompletionScreen action={schema.onComplete} />
        </div>
      </FormEngineThemeProvider>
    );
  }

  // Draft prompt
  if (showDraftPrompt) {
    return (
      <FormEngineThemeProvider theme={theme}>
        <div className={cn("flex flex-col gap-8", className)}>
          <DraftResumePrompt
            lastSavedAt={state.lastDraftSavedAt}
            onResume={handleResumeDraft}
            onDiscard={handleDiscardDraft}
          />
        </div>
      </FormEngineThemeProvider>
    );
  }

  return (
    <FormEngineThemeProvider theme={theme}>
      {/* A real <form>, in every display mode. Password managers detect a form
          submit event, Enter works natively, and screen readers get the form
          landmark — none of which a <div> provides.

          noValidate: the engine owns validation. Without it browsers show
          their own bubbles on required / type=email inputs alongside the
          engine's messages, so the respondent sees two error systems. */}
      <form
        className={cn("flex flex-col gap-8", className)}
        data-display-mode={displayMode}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <FieldRegistryProvider registry={registry}>
          <FormErrorBoundary>
            {displayMode === "classic" && (
              <ClassicModeContent
                engine={engine}
                state={state}
                registry={registry}
                fieldLabels={fieldLabels}
                autoFocus={autoFocus}
                submitLabel={submitLabel}
                hideNavigation={hideNavigation}
                submitError={showSubmitError}
                submitErrorLabel={submitErrorLabel}
              />
            )}

            {displayMode === "stepped" && (
              <SteppedModeContent
                engine={engine}
                state={state}
                registry={registry}
                fieldLabels={fieldLabels}
                autoFocus={autoFocus}
                prevLabel={prevLabel ?? schema.settings?.navigation?.backLabel}
                nextLabel={nextLabel ?? schema.settings?.navigation?.nextLabel}
                submitLabel={submitLabel ?? schema.settings?.submitButton?.label}
                onSubmit={handleSubmit}
                progressPosition={theme?.layout?.progressPosition}
                showProgress={schema.settings?.showProgress}
                showBack={schema.settings?.navigation?.showBack}
                hideNavigation={hideNavigation}
                submitError={showSubmitError}
                submitErrorLabel={submitErrorLabel}
              />
            )}

            {displayMode === "conversational" && (
              <ConversationalModeContent
                engine={engine}
                registry={registry}
                autoFocus={autoFocus}
                autoAdvance={autoAdvance}
                prevLabel={prevLabel}
                nextLabel={nextLabel}
                submitLabel={submitLabel}
                onSubmit={handleSubmit}
                hideNavigation={hideNavigation}
                submitError={showSubmitError}
                submitErrorLabel={submitErrorLabel}
              />
            )}
          </FormErrorBoundary>
        </FieldRegistryProvider>
      </form>
    </FormEngineThemeProvider>
  );
}

// ── Mode-specific content components ──

function ClassicModeContent({
  engine,
  state,
  registry,
  fieldLabels,
  autoFocus,
  submitLabel = "Submit",
  hideNavigation,
  submitError,
  submitErrorLabel,
}: {
  engine: FormEngine;
  state: FormState;
  registry: FieldRegistry;
  fieldLabels: Record<string, string>;
  autoFocus?: boolean;
  submitLabel?: string;
  hideNavigation?: boolean;
  submitError?: boolean;
  submitErrorLabel?: string;
}) {
  const theme = useTheme();
  return (
    <>
      {state.submitAttempted && !state.isSubmitted && (
        <ErrorSummary errors={state.errors} fieldLabels={fieldLabels} />
      )}
      {submitError && <SubmitErrorNotice message={submitErrorLabel} />}
      <ClassicModeRenderer
        engine={engine}
        theme={theme}
        registry={registry}
        autoFocus={autoFocus}
      />
      {!hideNavigation && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={state.isSubmitting}
            className={cn(
              "px-6 py-2 text-sm rounded-md",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              state.isSubmitting && "opacity-50 cursor-not-allowed",
            )}
          >
            {state.isSubmitting ? "Submitting\u2026" : submitLabel}
          </button>
        </div>
      )}
    </>
  );
}

function SteppedModeContent({
  engine,
  state,
  registry,
  fieldLabels,
  autoFocus,
  prevLabel,
  nextLabel,
  submitLabel,
  onSubmit,
  progressPosition,
  showProgress = true,
  showBack = true,
  hideNavigation,
  submitError,
  submitErrorLabel,
}: {
  engine: FormEngine;
  state: FormState;
  registry: FieldRegistry;
  fieldLabels: Record<string, string>;
  autoFocus?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  onSubmit: () => void;
  progressPosition?: string;
  showProgress?: boolean;
  showBack?: boolean;
  hideNavigation?: boolean;
  submitError?: boolean;
  submitErrorLabel?: string;
}) {
  const theme = useTheme();
  const visibleSections = engine.getVisibleSections();
  const currentSection = visibleSections.find((s) => s.id === state.currentSectionId);
  const isLastSection = state.currentSectionIndex === state.totalVisibleSections - 1;

  return (
    <div className="fc-mode-stepped flex flex-col gap-6">
      {showProgress && progressPosition !== "none" && (
        <ProgressBar
          percent={state.progressPercent}
          currentStep={state.currentSectionIndex + 1}
          totalSteps={state.totalVisibleSections}
        />
      )}

      {state.submitAttempted && !state.isSubmitted && (
        <ErrorSummary errors={state.errors} fieldLabels={fieldLabels} />
      )}
      {submitError && <SubmitErrorNotice message={submitErrorLabel} />}

      {currentSection && (
        <SectionRenderer
          section={currentSection}
          engine={engine}
          theme={theme}
          registry={registry}
          autoFocus={autoFocus}
        />
      )}

      {!hideNavigation && (
        <NavigationButtons
          canGoPrev={showBack ? state.canGoPrev : false}
          canGoNext={state.canGoNext}
          isLastSection={isLastSection}
          isSubmitting={state.isSubmitting}
          insideForm
          onPrev={() => engine.prevSection()}
          onNext={() => engine.nextSection()}
          onSubmit={onSubmit}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          submitLabel={submitLabel}
        />
      )}
    </div>
  );
}

function ConversationalModeContent({
  engine,
  registry,
  autoFocus,
  autoAdvance,
  prevLabel,
  nextLabel,
  submitLabel,
  onSubmit,
  hideNavigation,
  submitError,
  submitErrorLabel,
}: {
  engine: FormEngine;
  registry: FieldRegistry;
  autoFocus?: boolean;
  autoAdvance?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  onSubmit: () => void;
  hideNavigation?: boolean;
  submitError?: boolean;
  submitErrorLabel?: string;
}) {
  const theme = useTheme();
  return (
    <>
      {submitError && <SubmitErrorNotice message={submitErrorLabel} />}
      <ConversationalRenderer
        insideForm
        engine={engine}
        theme={theme}
        registry={registry}
        autoFocus={autoFocus}
        autoAdvance={autoAdvance}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        submitLabel={submitLabel}
        onSubmit={onSubmit}
        hideNavigation={hideNavigation}
      />
    </>
  );
}
