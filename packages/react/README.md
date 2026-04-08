# @squaredr/fieldcraft-react

React renderer for `@squaredr/fieldcraft-core` — 35+ pre-built form fields, hooks, theming, and a pluggable field registry. Styled with Tailwind CSS via shadcn/ui primitives.

## Install

```bash
npm install @squaredr/fieldcraft-core @squaredr/fieldcraft-react
```

## Quick Start

```tsx
import { FormEngineRenderer } from "@squaredr/fieldcraft-react";
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

Or if you use Tailwind CSS v4, import the shared theme and scan the component sources directly:

```css
@import "@squaredr/fieldcraft-react/../tooling/tailwind-config/theme.css";
@source "node_modules/@squaredr/fieldcraft-react/src/components/**/*.tsx";
```

## Components

### Core

| Component | Description |
|-----------|-------------|
| `FormEngineRenderer` | Full form renderer — pass a schema and get a working form |
| `SectionRenderer` | Renders a single section of fields |
| `FieldRenderer` | Renders a single field by type |
| `ProgressBar` | Multi-section progress indicator |
| `NavigationButtons` | Back/Next/Submit buttons |
| `ErrorSummary` | Validation error list |
| `CompletionScreen` | Post-submit confirmation |

### Field Types (35+)

**Text:** ShortTextField, LongTextField, EmailField, PhoneField, PhoneInternationalField, UrlField, LegalNameField

**Numeric:** NumberField, SliderField, RatingField, NpsField, LikertField, OpinionScaleField

**Selection:** SingleSelectField, MultiSelectField, DropdownField, BooleanField, CountrySelectField, RankingField

**Date/Time:** DateField, DateRangeField, TimeField, AppointmentField

**Media:** FileUploadField, SignatureField, ImageCaptureField

**Advanced:** AddressField, PaymentField, MatrixField, RepeaterField, CalculatedField, HiddenField, ScoringField

**Structural:** ConsentField, InfoBlockField

## Hooks

```tsx
import { useFormEngine } from "@squaredr/fieldcraft-react";

function CustomForm() {
  const engine = useFormEngine(schema);
  // engine.state, engine.setValue, engine.validate, etc.
}
```

| Hook | Description |
|------|-------------|
| `useFormEngine(schema, options?)` | Creates and subscribes to a form engine |
| `useFieldValue(engine, questionId)` | Reactive field value |
| `useFieldError(engine, questionId)` | Reactive field error |
| `useSectionProgress(engine)` | Section completion progress |

## Theme Presets

```tsx
import { FormEngineRenderer } from "@squaredr/fieldcraft-react";
import { darkPreset } from "@squaredr/fieldcraft-react";

<FormEngineRenderer schema={schema} onSubmit={handleSubmit} theme={darkPreset} />
```

Available presets: `cleanPreset`, `modernPreset`, `darkPreset`, `highContrastPreset`, `clinicalPreset`, `playfulPreset`

## Custom Field Registry

Override or add field components:

```tsx
import { createFieldRegistry, mergeRegistries, defaultRegistry } from "@squaredr/fieldcraft-react";

const customRegistry = mergeRegistries(defaultRegistry, {
  short_text: MyCustomTextField,
});

<FormEngineRenderer schema={schema} onSubmit={handleSubmit} registry={customRegistry} />
```

## Peer Dependencies

- `react` ^18 || ^19
- `react-dom` ^18 || ^19

## License

MIT
