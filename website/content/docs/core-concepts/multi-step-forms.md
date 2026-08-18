---
title: Multi-step forms
description: Split forms into sections with step navigation, progress tracking, per-step validation, and conditional branching.
---

## Display modes

The `settings.displayMode` property controls how sections are rendered:

| Mode | Behaviour |
|------|-----------|
| `classic` | All visible sections render on one scrollable page. A single Submit button at the bottom. |
| `stepped` | One section at a time. Next/Back buttons. Progress bar. **(default)** |
| `conversational` | One question at a time. Enter key to advance. Question-level progress. |

```ts
settings: {
  displayMode: 'stepped',
  showProgress: true,
  progressStyle: 'bar',
}
```

For a full guide on each mode with examples, see [Display modes](/docs/core-concepts/display-modes).

## Navigation

In `stepped` mode, the engine manages navigation state:

```ts
// FormState navigation properties
currentSectionId: string
currentSectionIndex: number         // Among visible sections
totalVisibleSections: number
progressPercent: number             // 0–100
visibleSectionIds: string[]
visitedSectionIds: string[]
canGoNext: boolean
canGoPrev: boolean
isCurrentSectionValid: boolean
```

### Navigation methods

```ts
const engine = createEngine(schema)

engine.nextSection()        // Move to next visible section
engine.prevSection()        // Move to previous section
engine.jumpTo('section-id') // Jump directly to a section
```

`nextSection()` validates the current section before advancing. If validation fails, the user stays on the current section and errors are displayed.

### Navigation settings

```ts
settings: {
  navigation: {
    showBack: true,            // Show "Back" button
    showSectionList: false,    // Show sidebar section list
    nextLabel: 'Continue',     // Custom button labels
    backLabel: 'Go Back',
    allowSkip: false,          // Allow skipping to any section
  },
}
```

## Progress tracking

Three progress styles are available:

```ts
settings: {
  showProgress: true,
  progressStyle: 'bar',       // 'bar' | 'steps' | 'percentage'
}
```

| Style | What it shows |
|-------|-------------|
| `bar` | A horizontal progress bar showing percent complete |
| `steps` | "Step 2 of 5" counter |
| `percentage` | "40% complete" text |

Progress is calculated based on the current section index relative to total visible sections. Hidden sections (where `showIf` is `false`) are excluded from the count.

## Per-section validation

When the user clicks "Next", the engine validates only the current section's visible fields. If any field has errors, navigation is blocked and errors are displayed.

```ts
const result = engine.validateSection('contact-details')
// { valid: false, errors: { email: ['Enter a valid email.'] }, firstErrorFieldId: 'email' }
```

On submit, the engine validates all visible fields across all sections.

## Conditional sections

Sections with `showIf` are dynamically included or excluded from navigation:

```ts
{
  id: 'developer_questions',
  title: 'Developer Experience',
  showIf: { field: 'role', operator: 'eq', value: 'developer' },
  questions: [/* ... */],
}
```

If the user selects "Developer", this section appears in the navigation flow. If they change their answer, it disappears — and if they were currently on it, the engine moves them to the first visible section.

## Jump rules (branching)

Use `onExit` on a section to create branching flows:

```ts
{
  id: 'triage',
  title: 'Triage',
  questions: [/* severity selector */],
  onExit: {
    rules: [
      {
        condition: { field: 'severity', operator: 'eq', value: 'critical' },
        jumpTo: 'escalation',
      },
      {
        condition: { field: 'severity', operator: 'eq', value: 'low' },
        jumpTo: 'self_service',
      },
    ],
    default: 'general_support',
  },
}
```

Rules are evaluated in order — first match wins. If no rule matches and no `default` is set, the next section in array order is used.

Jump rules and `showIf` work together but serve different purposes:
- `showIf` controls whether a section exists in the form
- `onExit` controls which section comes next when leaving

## Using hooks for navigation UI

The `useSectionProgress` hook provides reactive navigation state for custom UI:

```tsx
import { useSectionProgress } from '@squaredr/fieldcraft-react'

function ProgressHeader({ engine }) {
  const progress = useSectionProgress(engine)

  return (
    <div>
      <p>Step {progress.currentSectionIndex + 1} of {progress.totalVisibleSections}</p>
      <div style={{ width: `${progress.progressPercent}%` }} />
    </div>
  )
}
```

## Next steps

- [FormRenderer](/docs/react/form-renderer) — the main component and its props
- [Hooks](/docs/react/hooks) — useFormEngine, useFieldValue, useSectionProgress
- [Drafts & prefill](/docs/submission/drafts-and-prefill) — persist answers across sessions
