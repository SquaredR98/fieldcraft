---
title: Hooks
description: Four React hooks for accessing engine state, field values, validation errors, and navigation progress.
---

## useFormEngine

Creates and manages a `FormEngine` instance. This is the primary hook — it returns the engine with all methods plus a reactive `state` property.

```ts
function useFormEngine(
  schema: FormEngineSchema,
  options?: EngineOptions
): FormEngine & { state: FormState }
```

### Usage

```tsx
import { useFormEngine } from '@squaredr/fieldcraft-react'

function CustomForm({ schema }) {
  const engine = useFormEngine(schema, {
    onSubmit: async (response) => {
      await fetch('/api/submit', { method: 'POST', body: JSON.stringify(response) })
    },
  })

  const { state } = engine

  return (
    <div>
      <h1>{engine.getSchema().title}</h1>
      <p>{state.progressPercent}% complete</p>

      {engine.getVisibleFields(state.currentSectionId).map((field) => (
        <div key={field.id}>
          <label>{field.label}</label>
          <input
            value={(state.values[field.id] as string) || ''}
            onChange={(e) => engine.setValue(field.id, e.target.value)}
            onBlur={() => engine.touchField(field.id)}
          />
          {state.errors[field.id]?.map((err) => (
            <p key={err} style={{ color: 'red' }}>{err}</p>
          ))}
        </div>
      ))}

      {state.canGoPrev && <button onClick={() => engine.prevSection()}>Back</button>}
      {state.canGoNext && <button onClick={() => engine.nextSection()}>Next</button>}
      {!state.canGoNext && <button onClick={() => engine.submit()}>Submit</button>}
    </div>
  )
}
```

### EngineOptions

```ts
type EngineOptions = {
  mode?: 'controlled' | 'uncontrolled'
  initialValues?: Record<string, unknown>
  prefillValues?: Record<string, unknown>
  adapters?: SubmitAdapter | SubmitAdapter[]
  draftAdapter?: DraftAdapter
  analytics?: AnalyticsAdapter
  onSubmit?: (response: FormResponse) => void | Promise<void>
  onStateChange?: (state: FormState) => void
  onSectionChange?: (sectionId: string, index: number) => void
  onFieldChange?: (fieldId: string, value: unknown) => void
  validators?: Record<string, CustomValidator>
  asyncValidators?: Record<string, AsyncValidator>
  sessionToken?: string
}
```

### Engine methods

The returned engine includes all `FormEngine` methods:

| Method | Description |
|--------|-------------|
| `setValue(id, value)` | Set a field's value |
| `setValues(values)` | Set multiple values at once |
| `touchField(id)` | Mark a field as touched (enables error display) |
| `clearField(id)` | Clear a field's value |
| `nextSection()` | Navigate to next section (validates current section first) |
| `prevSection()` | Navigate to previous section |
| `jumpTo(sectionId)` | Jump to a specific section |
| `validate()` | Validate all visible fields |
| `validateSection(sectionId)` | Validate a single section |
| `submit()` | Submit the form |
| `saveDraft()` | Save current state as a draft |
| `loadDraft()` | Load a saved draft |
| `clearDraft()` | Clear the saved draft |
| `getVisibleSections()` | Get array of currently visible sections |
| `getVisibleFields(sectionId)` | Get visible fields for a section |
| `isFieldRequired(id)` | Check if a field is currently required |
| `isFieldVisible(id)` | Check if a field is currently visible |
| `isFieldDisabled(id)` | Check if a field is currently disabled |
| `getFieldError(id)` | Get error messages for a field |
| `getSchema()` | Get the original schema |
| `subscribe(listener)` | Subscribe to state changes (returns unsubscribe function) |
| `getState()` | Get current state snapshot |
| `destroy()` | Clean up the engine |

### Stability

The engine is created once in a `useRef` and survives React Strict Mode double-mounts. The `subscribe` and `getSnapshot` functions passed to `useSyncExternalStore` are stable references.

## useFieldValue

Subscribe to a single field's value. Re-renders only when that specific field changes.

```ts
function useFieldValue(engine: FormEngine, fieldId: string): unknown
```

```tsx
function PriceDisplay({ engine }) {
  const price = useFieldValue(engine, 'total_price')

  return <p>Total: ${typeof price === 'number' ? price.toFixed(2) : '—'}</p>
}
```

## useFieldError

Subscribe to a field's validation errors. Returns the error array or `undefined`.

```ts
function useFieldError(engine: FormEngine, fieldId: string): string[] | undefined
```

```tsx
function FieldWithError({ engine, fieldId }) {
  const errors = useFieldError(engine, fieldId)

  return (
    <div>
      {errors?.map((err) => (
        <p key={err} className="error">{err}</p>
      ))}
    </div>
  )
}
```

## useSectionProgress

Subscribe to multi-step navigation state. Returns a progress object.

```ts
function useSectionProgress(engine: FormEngine): SectionProgress
```

```ts
type SectionProgress = {
  currentSectionId: string
  currentSectionIndex: number
  totalVisibleSections: number
  progressPercent: number
  visitedSectionIds: string[]
  canGoNext: boolean
  canGoPrev: boolean
}
```

```tsx
function StepIndicator({ engine }) {
  const progress = useSectionProgress(engine)

  return (
    <div>
      Step {progress.currentSectionIndex + 1} of {progress.totalVisibleSections}
      <progress value={progress.progressPercent} max={100} />
    </div>
  )
}
```

## Next steps

- [Theming](/docs/react/theming) — customise colours, typography, and spacing
- [Custom field types](/docs/react/custom-field-types) — build your own field components
- [FormRenderer](/docs/react/form-renderer) — the all-in-one component
