import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const homepageConditionalSchema: FormEngineSchema = {
  id: "homepage-conditional",
  version: "1.0.0",
  title: "Conference Registration",
  description: "Fields appear and hide based on your answers.",
  settings: {
    showProgress: false,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "registration",
      title: "Registration",
      questions: [
        {
          id: "ticket",
          type: "single_select",
          label: "Ticket type",
          required: true,
          options: [
            { label: "General admission", value: "general" },
            { label: "Workshop pass", value: "workshop" },
            { label: "VIP", value: "vip" },
          ],
        },
        {
          id: "dinner",
          type: "boolean",
          label: "Attending conference dinner?",
        },
        {
          id: "dietary",
          type: "dropdown",
          label: "Dietary preference",
          helpText: "Shown because dinner is selected",
          options: [
            { label: "No restrictions", value: "none" },
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Vegan", value: "vegan" },
            { label: "Gluten-free", value: "gluten_free" },
          ],
          showIf: {
            combine: "AND",
            conditions: [
              { field: "dinner", operator: "eq", value: true },
            ],
          },
        },
        {
          id: "workshops",
          type: "multi_select",
          label: "Choose your workshops",
          helpText: "Only visible with a workshop pass",
          options: [
            { label: "Schema Design", value: "schema" },
            { label: "Custom Validators", value: "validators" },
            { label: "Adapters Deep Dive", value: "adapters" },
          ],
          showIf: {
            combine: "AND",
            conditions: [
              { field: "ticket", operator: "eq", value: "workshop" },
            ],
          },
        },
      ],
    },
  ],
};
