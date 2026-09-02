---
title: Display modes
description: Control how your form is presented — all at once, one section at a time, or one question at a time.
---

FieldCraft supports three display modes that change how the form is rendered without altering your schema structure. Set the mode via `settings.displayMode` in your schema.

## Stepped (default)

One section at a time with Back/Next navigation and a progress bar. The user advances through sections sequentially. Validation runs per-section before allowing navigation.

```ts
const schema = {
  id: 'onboarding',
  version: '1.0.0',
  title: 'Onboarding',
  settings: {
    displayMode: 'stepped',
    showProgress: true,
    navigation: {
      showBack: true,
      nextLabel: 'Continue',
      backLabel: 'Go Back',
    },
    submitButton: {
      label: 'Complete Setup',
    },
  },
  sections: [/* ... */],
  submitAction: { type: 'callback' },
}
```

### Stepped mode settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `showProgress` | `boolean` | `true` | Show or hide the progress bar |
| `navigation.showBack` | `boolean` | `true` | Show or hide the Back button |
| `navigation.nextLabel` | `string` | `"Next"` | Label for the Next button |
| `navigation.backLabel` | `string` | `"Back"` | Label for the Back button |
| `submitButton.label` | `string` | `"Submit"` | Label for the Submit button on the last section |

### State properties

```ts
const state = engine.getState()

state.currentSectionId       // ID of the active section
state.currentSectionIndex    // 0-based index among visible sections
state.totalVisibleSections   // Total visible sections
state.progressPercent        // 0–100
state.canGoNext              // Can advance to next section
state.canGoPrev              // Can go back to previous section
```

## Classic

All visible sections render on a single scrollable page. No navigation buttons — just a Submit button at the bottom. Suited for short forms or forms where users need to see all fields at once.

```ts
settings: {
  displayMode: 'classic',
}
```

In classic mode, section-level navigation methods (`nextSection`, `prevSection`) still work programmatically but there are no navigation buttons rendered. Validation runs across all sections on submit.

## Conversational

One question at a time, Typeform-style. The user sees a single question with a progress counter and can advance with the Enter key or the Next button. Validation runs per-question before allowing navigation.

```ts
settings: {
  displayMode: 'conversational',
}
```

### Question-level navigation

Conversational mode uses question-level navigation that flattens all visible input questions across all sections into a single sequence. Structural fields (headers, dividers, page breaks, info blocks, etc.) are automatically skipped.

#### Engine methods

```ts
engine.nextQuestion()          // Validate current question, advance to next
engine.prevQuestion()          // Go back to previous question (no validation)
engine.getVisibleQuestions()   // Get all visible input questions in order
```

`nextQuestion()` validates the current question before advancing. If validation fails, the user stays on the current question and the error is displayed. It returns `true` on success, `false` if blocked.

`prevQuestion()` does not validate — users can always go back.

Both methods automatically cross section boundaries. If the next question is in a different section, the engine updates `currentSectionId` and fires the `onSectionChange` callback.

#### State properties

```ts
const state = engine.getState()

state.currentQuestionId         // ID of the active question
state.currentQuestionIndex      // 0-based index among all visible questions
state.totalVisibleQuestions     // Total visible input questions
state.questionProgressPercent   // 0–100 (question-level)
state.canGoNextQuestion         // Can advance to next question
state.canGoPrevQuestion         // Can go back to previous question
```

#### VisibleQuestion type

`getVisibleQuestions()` returns an array of `VisibleQuestion` objects:

```ts
import type { VisibleQuestion } from '@squaredr/fieldcraft-core'

type VisibleQuestion = {
  question: Question    // The question definition
  sectionId: string     // Parent section ID
  globalIndex: number   // 0-based index across all sections
}
```

### Keyboard support

In the React renderer, conversational mode supports:

- **Enter** — advance to next question (or submit on the last question)
- Enter is not intercepted inside `<textarea>` fields (where Enter creates a new line)

### What gets skipped

Structural field types are excluded from question-level navigation. These types are never shown as standalone questions:

`section_header`, `info_block`, `page_break`, `welcome-screen`, `thank-you-screen`, `rich-text`, `image`, `video`, `divider`, `spacer`

Questions hidden by `showIf` conditions are also excluded. If a question becomes visible after the user answers a previous question, it is dynamically inserted into the sequence.

## Switching modes at runtime

Display mode is read from the schema at engine creation time. To switch modes, create a new engine with a modified schema:

```tsx
const [mode, setMode] = useState<'stepped' | 'classic' | 'conversational'>('stepped')

const schema = useMemo(() => ({
  ...baseSchema,
  settings: { ...baseSchema.settings, displayMode: mode },
}), [baseSchema, mode])

// key={mode} forces re-mount with a fresh engine
<FormEngineRenderer key={mode} schema={schema} onSubmit={handleSubmit} />
```

## Next steps

- [Multi-step forms](/docs/core-concepts/multi-step-forms) — section navigation, jump rules, progress tracking
- [FormEngineRenderer](/docs/react/form-renderer) — the main component and its props
- [Theming](/docs/react/theming) — customize the look of any display mode
