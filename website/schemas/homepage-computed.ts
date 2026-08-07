import type { FormEngineSchema } from "@squaredr/fieldcraft-core";

export const homepageComputedSchema: FormEngineSchema = {
  id: "homepage-computed",
  version: "1.0.0",
  title: "License Calculator",
  description: "Computed fields update in real time as you change inputs.",
  settings: {
    showProgress: false,
  },
  submitAction: { type: "callback" },
  sections: [
    {
      id: "calculator",
      title: "Calculator",
      questions: [
        {
          id: "seats",
          type: "number",
          label: "Number of seats",
          required: true,
          helpText: "Between 1 and 25",
          validation: [
            { type: "min", value: 1 },
            { type: "max", value: 25 },
          ],
        },
        {
          id: "price",
          type: "number",
          label: "Price per seat",
          required: true,
          helpText: "e.g. 99 for Standard, 249 for Enterprise",
          validation: [{ type: "min", value: 1 }],
        },
        {
          id: "subtotal",
          type: "calculated",
          label: "Subtotal",
          config: {
            type: "calculated" as const,
            expression: "{seats} * {price}",
            format: "currency",
          },
        },
        {
          id: "discount",
          type: "calculated",
          label: "Volume discount (10%)",
          config: {
            type: "calculated" as const,
            expression: "{seats} * {price} * 0.1",
            format: "currency",
          },
        },
        {
          id: "total",
          type: "calculated",
          label: "Total",
          config: {
            type: "calculated" as const,
            expression: "{seats} * {price} - {seats} * {price} * 0.1",
            format: "currency",
          },
        },
      ],
    },
  ],
};
