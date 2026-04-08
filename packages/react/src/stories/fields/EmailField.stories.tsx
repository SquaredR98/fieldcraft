import type { Meta, StoryObj } from "@storybook/react";
import { EmailField } from "../../components/fields/EmailField";
import type { EmailConfig } from "@squaredr/fieldcraft-core";

const meta: Meta<typeof EmailField> = {
  title: "Fields/EmailField",
  component: EmailField,
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
type Story = StoryObj<typeof EmailField>;

const baseField: EmailConfig = {
  id: "email",
  type: "email",
  label: "Email Address",
  required: true,
};

export const Default: Story = {
  args: {
    field: baseField,
    value: "",
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    field: baseField,
    value: "alice@example.com",
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    field: {
      ...baseField,
      helperText: "We'll never share your email with anyone else",
    },
    value: "",
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: baseField,
    value: "invalid-email",
    error: "Please enter a valid email address",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    field: baseField,
    value: "locked@example.com",
    disabled: true,
    onChange: () => {},
  },
};

export const Optional: Story = {
  args: {
    field: {
      ...baseField,
      required: false,
      helperText: "Optional field",
    },
    value: "",
    onChange: () => {},
  },
};
