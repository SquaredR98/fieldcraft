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
} from "@squaredr/fieldcraft-core";
import { useFormEngine } from "../hooks/useFormEngine";
import { FormEngineThemeProvider, useTheme } from "../theme/ThemeProvider";
import { defaultRegistry } from "../registry/default-registry";
import { mergeRegistries, type FieldRegistry } from "../registry/field-registry";
import { SectionRenderer } from "./SectionRenderer";
import { ProgressBar } from "./ProgressBar";
import { NavigationButtons } from "./NavigationButtons";
import { ErrorSummary } from "./ErrorSummary";
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
  onStateChange?: (state: FormState) => void;

  // Draft
  sessionToken?: string;
  draftAdapter?: import("@squaredr/fieldcraft-core").DraftAdapter;
  autoSaveIntervalMs?: number;
  draftMigrations?: Record<string, (draft: import("@squaredr/fieldcraft-core").DraftSnapshot) => import("@squaredr/fieldcraft-core").DraftSnapshot>;

  // Submission hooks & analytics
  beforeSubmit?: (response: FormResponse) => FormResponse | false | Promise<FormResponse | false>;
  analytics?: import("@squaredr/fieldcraft-core").AnalyticsAdapter;
  onEvent?: (event: import("@squaredr/fieldcraft-core").FieldCraftEvent) => void;
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

  const handleSubmit = useCallback(async () => {
    const result = await engine.submit();
    if (!result.success) {
      const validation = engine.validate();
      onValidationError?.(validation.errors);
    }
  }, [engine, onValidationError]);

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
      <div className={cn("flex flex-col gap-8", className)} data-display-mode={displayMode}>
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
                onSubmit={handleSubmit}
                hideNavigation={hideNavigation}
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
              />
            )}
          </FormErrorBoundary>
        </FieldRegistryProvider>
      </div>
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
  onSubmit,
  hideNavigation,
}: {
  engine: FormEngine;
  state: import("@squaredr/fieldcraft-core").FormState;
  registry: FieldRegistry;
  fieldLabels: Record<string, string>;
  autoFocus?: boolean;
  submitLabel?: string;
  onSubmit: () => void;
  hideNavigation?: boolean;
}) {
  const theme = useTheme();
  return (
    <>
      {state.submitAttempted && !state.isSubmitted && (
        <ErrorSummary errors={state.errors} fieldLabels={fieldLabels} />
      )}
      <ClassicModeRenderer
        engine={engine}
        theme={theme}
        registry={registry}
        autoFocus={autoFocus}
      />
      {!hideNavigation && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSubmit}
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
}: {
  engine: FormEngine;
  state: import("@squaredr/fieldcraft-core").FormState;
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
}) {
  const theme = useTheme();
  const visibleSections = engine.getVisibleSections();
  const currentSection = visibleSections.find(
    (s) => s.id === state.currentSectionId,
  );
  const isLastSection =
    state.currentSectionIndex === state.totalVisibleSections - 1;

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
}) {
  const theme = useTheme();
  return (
    <ConversationalRenderer
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
  );
}
