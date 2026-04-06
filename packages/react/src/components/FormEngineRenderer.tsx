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
} from "@squaredr/formengine-core";
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

  // Custom validators
  validators?: Record<string, CustomValidator>;
  asyncValidators?: Record<string, AsyncValidator>;

  // Labels
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
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
  validators,
  asyncValidators,
  prevLabel,
  nextLabel,
  submitLabel,
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
  });

  const { state } = engine;

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

  const visibleSections = engine.getVisibleSections();
  const currentSection = visibleSections.find(
    (s) => s.id === state.currentSectionId,
  );
  const isLastSection =
    state.currentSectionIndex === state.totalVisibleSections - 1;

  return (
    <FormEngineThemeProvider theme={theme}>
      <div className={cn("flex flex-col gap-8", className)}>
        {theme?.layout?.progressPosition !== "none" && (
          <ProgressBar
            percent={state.progressPercent}
            currentStep={state.currentSectionIndex + 1}
            totalSteps={state.totalVisibleSections}
          />
        )}

        {state.submitAttempted && !state.isSubmitted && (
          <ErrorSummary
            errors={state.errors}
            fieldLabels={fieldLabels}
          />
        )}

        {currentSection && (
          <FormEngineRendererInner
            section={currentSection}
            engine={engine}
            registry={registry}
          />
        )}

        <NavigationButtons
          canGoPrev={state.canGoPrev}
          canGoNext={state.canGoNext}
          isLastSection={isLastSection}
          isSubmitting={state.isSubmitting}
          onPrev={() => engine.prevSection()}
          onNext={() => engine.nextSection()}
          onSubmit={handleSubmit}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          submitLabel={submitLabel}
        />
      </div>
    </FormEngineThemeProvider>
  );
}

/** Inner renderer uses theme context. */
function FormEngineRendererInner({
  section,
  engine,
  registry,
}: {
  section: import("@squaredr/formengine-core").Section;
  engine: FormEngine;
  registry: FieldRegistry;
}) {
  const theme = useTheme();
  return (
    <SectionRenderer
      section={section}
      engine={engine}
      theme={theme}
      registry={registry}
    />
  );
}
