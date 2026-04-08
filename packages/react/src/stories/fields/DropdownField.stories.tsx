import type { Meta, StoryObj } from "@storybook/react";
import { DropdownField } from "../../components/fields/DropdownField";
import type { DropdownConfig } from "@squaredr/fieldcraft-core";

const meta: Meta<typeof DropdownField> = {
  title: "Fields/DropdownField",
  component: DropdownField,
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
type Story = StoryObj<typeof DropdownField>;

const baseField: DropdownConfig = {
  id: "country",
  type: "dropdown",
  label: "Country",
  required: true,
  options: [
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
    { label: "Australia", value: "au" },
    { label: "Germany", value: "de" },
  ],
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
    value: "uk",
    onChange: () => {},
  },
};

export const WithHelperText: Story = {
  args: {
    field: {
      ...baseField,
      helperText: "Select your country of residence",
    },
    value: null,
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    field: baseField,
    value: null,
    error: "Please select a country",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    field: baseField,
    value: "us",
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
    value: null,
    onChange: () => {},
  },
};

export const ManyOptions: Story = {
  args: {
    field: {
      id: "state",
      type: "dropdown",
      label: "State",
      required: true,
      options: [
        { label: "Alabama", value: "AL" },
        { label: "Alaska", value: "AK" },
        { label: "Arizona", value: "AZ" },
        { label: "Arkansas", value: "AR" },
        { label: "California", value: "CA" },
        { label: "Colorado", value: "CO" },
        { label: "Connecticut", value: "CT" },
        { label: "Delaware", value: "DE" },
        { label: "Florida", value: "FL" },
        { label: "Georgia", value: "GA" },
        // ... many more states
        { label: "Wyoming", value: "WY" },
      ],
    },
    value: null,
    onChange: () => {},
  },
};
