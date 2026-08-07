import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const selectionFieldsDemo: FormEngineSchema = {
  id: "selection-fields-demo",
  version: "1.0.0",
  title: "Selection Field Types",
  description: "Demonstrates all selection-based fields: single select, multi select, dropdown, boolean, country select, and ranking.",
  settings: {
    showProgress: true,
    progressStyle: "percentage",
  },
  sections: [
    {
      id: "single-choices",
      title: "Single Choice Fields",
      questions: [
        {
          id: "single_select_example",
          type: "single_select",
          label: "Favourite Framework",
          required: true,
          helpText: "Radio-button style single selection",
          options: [
            { label: "React", value: "react" },
            { label: "Vue", value: "vue" },
            { label: "Angular", value: "angular" },
            { label: "Svelte", value: "svelte" },
            { label: "Solid", value: "solid" },
          ],
        },
        {
          id: "dropdown_example",
          type: "dropdown",
          label: "Experience Level",
          required: true,
          helpText: "Dropdown select with searchable options",
          options: [
            { label: "Beginner (< 1 year)", value: "beginner" },
            { label: "Junior (1-3 years)", value: "junior" },
            { label: "Mid-level (3-5 years)", value: "mid" },
            { label: "Senior (5-10 years)", value: "senior" },
            { label: "Lead / Principal (10+ years)", value: "lead" },
          ],
        },
        {
          id: "boolean_example",
          type: "boolean",
          label: "Are you currently employed?",
          required: true,
          helpText: "Yes/No toggle field",
        },
        {
          id: "country_select_example",
          type: "country_select",
          label: "Country of Residence",
          required: false,
          helpText: "Built-in country selector with all countries",
        },
      ],
    },
    {
      id: "multi-choices",
      title: "Multi Choice & Ranking",
      questions: [
        {
          id: "multi_select_example",
          type: "multi_select",
          label: "Technologies You Use",
          required: true,
          helpText: "Checkbox style — select multiple options",
          options: [
            { label: "TypeScript", value: "typescript" },
            { label: "JavaScript", value: "javascript" },
            { label: "Python", value: "python" },
            { label: "Go", value: "go" },
            { label: "Rust", value: "rust" },
            { label: "Java", value: "java" },
            { label: "C#", value: "csharp" },
          ],
        },
        {
          id: "ranking_example",
          type: "ranking",
          label: "Rank These Priorities",
          required: false,
          helpText: "Drag to reorder from most to least important",
          options: [
            { label: "Performance", value: "performance" },
            { label: "Developer Experience", value: "dx" },
            { label: "Documentation", value: "docs" },
            { label: "Community Size", value: "community" },
            { label: "Bundle Size", value: "bundle" },
          ],
        },
      ],
    },
  ],
  submitAction: { type: "callback" },
};
