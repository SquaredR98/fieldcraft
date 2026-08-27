# @squaredr/fieldcraft-react

React renderer for `@squaredr/fieldcraft-core` — 44 pre-built form fields, hooks, theming, and a pluggable field registry. Styled with Tailwind CSS via shadcn/ui primitives.

[![npm version](https://img.shields.io/npm/v/@squaredr/fieldcraft-react)](https://www.npmjs.com/package/@squaredr/fieldcraft-react)
[![npm downloads](https://img.shields.io/npm/dm/@squaredr/fieldcraft-react)](https://www.npmjs.com/package/@squaredr/fieldcraft-react)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

> **Website:** [fieldcraft.squaredr.tech](https://fieldcraft.squaredr.tech) · **Docs:** [fieldcraft.squaredr.tech/docs](https://fieldcraft.squaredr.tech/docs) · **GitHub:** [github.com/SquaredR98/fieldcraft](https://github.com/SquaredR98/fieldcraft)

## Install

```bash
npm install @squaredr/fieldcraft-core @squaredr/fieldcraft-react
```

## Quick Start

```tsx
import { FormEngineRenderer } from "@squaredr/fieldcraft-react";
import "@squaredr/fieldcraft-react/styles.css";
import type { FormEngineSchema, FormResponse } from "@squaredr/fieldcraft-core";

const schema: FormEngineSchema = {
  id: "feedback",
  version: "1.0.0",
  title: "Feedback",
  submitAction: { type: "callback" },
  sections: [
    {
      id: "main",
      title: "Your Feedback",
      questions: [
        { id: "name", type: "short_text", label: "Name", required: true },
        { id: "rating", type: "rating", label: "How would you rate us?", config: { maxStars: 5 } },
        { id: "comments", type: "long_text", label: "Comments" },
      ],
    },
  ],
};

function App() {
  const handleSubmit = async (response: FormResponse) => {
    console.log(response);
  };

  return <FormEngineRenderer schema={schema} onSubmit={handleSubmit} />;
}
```

That's it. `FormEngineRenderer` creates its own engine, renders all fields, handles validation, and calls your `onSubmit` callback.

## Styling

Import the pre-built stylesheet in your app entry point:

```tsx
import "@squaredr/fieldcraft-react/styles.css";
```

Or if you use Tailwind CSS v4, import the stylesheet and let Tailwind scan the distributed component classes:

```css
@import "@squaredr/fieldcraft-react/styles.css";
```

### CSS Architecture

All field components use semantic `.fc-*` CSS classes (FieldCraft namespace) defined in the stylesheet. Visual styling flows through CSS custom properties set by `FormEngineThemeProvider`, so you can override any aspect with your own CSS:

```css
/* Override in your own stylesheet */
.fc-option-active {
  border-color: var(--primary);
  background: var(--primary / 0.08);
}
```

## Components

### Core

| Component | Description |
|-----------|-------------|
| `FormEngineRenderer` | Full form renderer — pass a schema and get a working form. Supports `stepped`, `classic`, and `conversational` display modes via `schema.settings.displayMode` |
| `ClassicModeRenderer` | Renders all sections at once in a scrollable layout |
| `ConversationalRenderer` | One question at a time with Enter key support |
| `SectionRenderer` | Renders a single section of fields |
| `FieldRenderer` | Renders a single field by type |
| `ProgressBar` | Multi-section progress indicator |
| `NavigationButtons` | Back/Next/Submit buttons |
| `ErrorSummary` | Validation error list |
| `CompletionScreen` | Post-submit confirmation |

### Field Types (42)

**Text:** ShortTextField, LongTextField, EmailField, PhoneField, PhoneInternationalField, UrlField, LegalNameField

**Numeric:** NumberField, SliderField, RatingField, NpsField, LikertField, OpinionScaleField

**Selection:** SingleSelectField, MultiSelectField, DropdownField, BooleanField, CountrySelectField, RankingField

**Date/Time:** DateField, DateRangeField, TimeField, AppointmentField

**Media:** FileUploadField, SignatureField, ImageCaptureField

**Advanced:** AddressField, PaymentField, MatrixField, RepeaterField, CalculatedField, HiddenField, ScoringField

**Structural:** ConsentField, InfoBlockField

### UI Primitives (shadcn/ui)

Re-exported for use in custom field components:

Alert, Badge, Button, Calendar, Card, Checkbox, Collapsible, Input, Label, Popover, Progress, RadioGroup, Select, Separator, Slider, Switch, Table, Textarea, Toggle, ToggleGroup

## Engine & Hooks

The react package re-exports `createEngine`, `FormEngine`, `EngineOptions`, and `ValidationResult` from `@squaredr/fieldcraft-core` for convenience — no need to import from core separately:

```tsx
import { useFormEngine, createEngine } from "@squaredr/fieldcraft-react";
import type { FormEngine } from "@squaredr/fieldcraft-react";
```

### useFormEngine

```tsx
import { useFormEngine } from "@squaredr/fieldcraft-react";

function CustomForm({ schema }) {
  const engine = useFormEngine(schema);

  return (
    <div>
      <p>Current section: {engine.state.currentSectionId}</p>
      <button onClick={() => engine.setValue("name", "Alice")}>Set name</button>
      <button onClick={() => engine.nextSection()}>Next</button>
    </div>
  );
}
```

The hook returns a proxy that is resilient to React Strict Mode — it lazily re-creates the engine if it was destroyed during a Strict Mode remount cycle.

| Hook | Description |
|------|-------------|
| `useFormEngine(schema, options?)` | Creates and subscribes to a form engine |
| `useFieldValue(engine, fieldId)` | Reactive field value |
| `useFieldError(engine, fieldId)` | Reactive field error |
| `useSectionProgress(engine)` | Section completion progress |
| `useFormDirty(engine)` | Whether any field has changed from initial |
| `useFieldVisibility(engine, fieldId)` | Whether a field is currently visible |
| `useFormProgress(engine)` | `{ current, total, percentage }` |
| `useConditionalFields(engine)` | Map of all field IDs to their visibility |
| `useFormSubmit(engine)` | `{ submit, isSubmitting, isSubmitted, error }` |
| `useFieldOptions(engine, fieldId)` | Options array for select/dropdown fields |

## Theme Presets

```tsx
import { FormEngineRenderer, darkPreset } from "@squaredr/fieldcraft-react";

<FormEngineRenderer schema={schema} onSubmit={handleSubmit} theme={darkPreset} />
```

Available presets: `cleanPreset`, `modernPreset`, `darkPreset`, `highContrastPreset`, `clinicalPreset`, `playfulPreset`

## Display Modes

Control how the form is presented by setting `displayMode` in your schema settings:

```typescript
const schema: FormEngineSchema = {
  id: "my-form",
  version: "1.0.0",
  title: "My Form",
  settings: {
    displayMode: "conversational", // "stepped" | "classic" | "conversational"
  },
  // ...
};
```

| Mode | Behavior |
|------|----------|
| `stepped` (default) | One section at a time with Back/Next navigation and progress bar |
| `classic` | All sections rendered at once in a scrollable layout with a single Submit button |
| `conversational` | One question at a time with Enter key to advance, auto-focus, and question-level progress |

Additional settings for stepped mode:

```typescript
settings: {
  displayMode: "stepped",
  showProgress: true,           // show/hide progress bar
  navigation: {
    showBack: true,             // show/hide back button
    backLabel: "Previous",      // custom back button label
    nextLabel: "Continue",      // custom next button label
  },
  submitButton: {
    label: "Send",              // custom submit button label
  },
}
```

## Custom Field Registry

Override or add field components:

```tsx
import { createFieldRegistry, mergeRegistries, defaultRegistry } from "@squaredr/fieldcraft-react";

const customRegistry = mergeRegistries(defaultRegistry, {
  short_text: MyCustomTextField,
});

<FormEngineRenderer schema={schema} onSubmit={handleSubmit} components={customRegistry} />
```

## Peer Dependencies

- `react` ^18 || ^19
- `react-dom` ^18 || ^19
- `@squaredr/fieldcraft-core` ^1.7.1

## Community

- [Discord](https://discord.gg/FK8pszp5z) — Get help, share projects, request features
- [Docs](https://fieldcraft.squaredr.tech/docs) — Full documentation
- [GitHub](https://github.com/SquaredR98/fieldcraft) — Source code and issues

## License

MIT
