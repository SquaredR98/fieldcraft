import type { Meta, StoryObj } from "@storybook/react";
import { BooleanField } from "../../components/fields/BooleanField";
import type { BooleanConfig } from "@squaredr/formengine-core";

const meta: Meta<typeof BooleanField> = {
  title: "Fields/BooleanField",
  component: BooleanField,
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
type Story = StoryObj<typeof BooleanField>;

const baseField: BooleanConfig = {
  id: "terms",
  type: "boolean",
  label: "I agree to the terms and conditions",
  required: true,
};

export const Default: Story = {
  args: {
    field: baseField,
    value: null,
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    field: baseField,
    value: true,
    onChange: () => {},
  },
};

export const Unchecked: Story = {
  args: {
    field: baseField,
    value: false,
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    field: {
      ...baseField,
      helperText: "You must accept the terms to continue",
    },
    value: null,
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: baseField,
    value: null,
    error: "You must accept the terms and conditions",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    field: baseField,
    value: true,
    disabled: true,
    onChange: () => {},
  },
};

export const Optional: Story = {
  args: {
    field: {
      id: "newsletter",
      type: "boolean",
      label: "Subscribe to our newsletter",
      required: false,
      helperText: "Stay updated with our latest news and offers",
    },
    value: false,
    onChange: () => {},
  },
};

export const LongLabel: Story = {
  args: {
    field: {
      id: "privacy",
      type: "boolean",
      label:
        "I have read and understood the Privacy Policy and consent to the collection, processing, and storage of my personal data as described therein",
      required: true,
    },
    value: null,
    onChange: () => {},
  },
};
