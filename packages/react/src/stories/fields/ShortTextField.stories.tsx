import type { Meta, StoryObj } from "@storybook/react";
import { ShortTextField } from "../../components/fields/ShortTextField";
import type { ShortTextConfig } from "@squaredr/formengine-core";

const meta: Meta<typeof ShortTextField> = {
  title: "Fields/ShortTextField",
  component: ShortTextField,
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
type Story = StoryObj<typeof ShortTextField>;

const baseField: ShortTextConfig = {
  id: "name",
  type: "shortText",
  label: "Your Name",
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
    value: "Alice Johnson",
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    field: {
      ...baseField,
      helperText: "Enter your full legal name",
    },
    value: "",
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: baseField,
    value: "",
    error: "Name is required",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    field: baseField,
    value: "Locked value",
    disabled: true,
    onChange: () => {},
  },
};

export const Optional: Story = {
  args: {
    field: {
      ...baseField,
      required: false,
    },
    value: "",
    onChange: () => {},
  },
};

export const WithValidation: Story = {
  args: {
    field: {
      ...baseField,
      validation: {
        minLength: 2,
        maxLength: 50,
      },
      helperText: "2-50 characters",
    },
    value: "A",
    error: "Name must be at least 2 characters",
    onChange: () => {},
  },
};
