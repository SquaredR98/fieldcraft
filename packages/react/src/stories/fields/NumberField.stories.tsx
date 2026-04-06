import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "../../components/fields/NumberField";
import type { NumberConfig } from "@squaredr/formengine-core";

const meta: Meta<typeof NumberField> = {
  title: "Fields/NumberField",
  component: NumberField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
};

export default meta;
type Story = StoryObj<typeof NumberField>;

const baseField: NumberConfig = {
  id: "age",
  type: "number",
  label: "Age",
  required: true,
};

export const Default: Story = {
  args: {
    field: baseField,
    value: null,
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    field: baseField,
    value: 25,
    onChange: () => {},
  },
};

export const WithMinMax: Story = {
  args: {
    field: {
      ...baseField,
      min: 18,
      max: 100,
      helperText: "Must be between 18 and 100",
    },
    value: 25,
    onChange: () => {},
  },
};

export const WithPrefix: Story = {
  args: {
    field: {
      id: "price",
      type: "number",
      label: "Price",
      required: true,
      prefix: "$",
    },
    value: 99.99,
    onChange: () => {},
  },
};

export const WithSuffix: Story = {
  args: {
    field: {
      id: "weight",
      type: "number",
      label: "Weight",
      required: true,
      suffix: "kg",
    },
    value: 75,
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: {
      ...baseField,
      min: 18,
    },
    value: 15,
    error: "Age must be at least 18",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    field: baseField,
    value: 30,
    disabled: true,
    onChange: () => {},
  },
};

export const WithStep: Story = {
  args: {
    field: {
      id: "rating",
      type: "number",
      label: "Rating",
      required: true,
      min: 0,
      max: 5,
      step: 0.5,
      helperText: "0 to 5 in 0.5 increments",
    },
    value: 4.5,
    onChange: () => {},
  },
};
