import type { Meta, StoryObj } from "@storybook/react";
import { FormRenderer } from "../../components/FormRenderer";
import { useFormEngine } from "../../hooks/useFormEngine";
import type { FormEngineSchema } from "@squaredr/formengine-core";

const contactFormSchema: FormEngineSchema = {
  id: "contact-form",
  title: "Contact Us",
  description: "Get in touch with our team",
  settings: {
    progressBar: "percentage",
    showQuestionNumbers: true,
  },
  sections: [
    {
      id: "personal-info",
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        {
          id: "name",
          type: "shortText",
          label: "Full Name",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50,
          },
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          required: true,
        },
        {
          id: "phone",
          type: "phoneNumber",
          label: "Phone Number",
          required: false,
          helperText: "We'll only call if necessary",
        },
      ],
    },
    {
      id: "message",
      title: "Your Message",
      description: "How can we help you?",
      fields: [
        {
          id: "subject",
          type: "dropdown",
          label: "Subject",
          required: true,
          options: [
            { label: "General Inquiry", value: "general" },
            { label: "Technical Support", value: "support" },
            { label: "Sales", value: "sales" },
            { label: "Feedback", value: "feedback" },
          ],
        },
        {
          id: "message",
          type: "longText",
          label: "Message",
          required: true,
          validation: {
            minLength: 10,
            maxLength: 500,
          },
          helperText: "Please provide details about your inquiry",
        },
        {
          id: "newsletter",
          type: "boolean",
          label: "Subscribe to our newsletter",
          required: false,
        },
      ],
    },
  ],
  submitAction: {
    type: "http",
    url: "https://api.example.com/contact",
    method: "POST",
  },
};

function ContactFormExample() {
  const engine = useFormEngine({
    schema: contactFormSchema,
    submitAdapter: {
      name: "mock",
      async submit(response) {
        console.log("Form submitted:", response);
        alert(`Form submitted successfully!\n\nValues: ${JSON.stringify(response.values, null, 2)}`);
      },
    },
  });

  return <FormRenderer engine={engine} />;
}

const meta: Meta<typeof ContactFormExample> = {
  title: "Forms/Contact Form",
  component: ContactFormExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContactFormExample>;

export const Default: Story = {};

export const WithInitialValues: Story = {
  render: () => {
    const engine = useFormEngine({
      schema: contactFormSchema,
      initialValues: {
        name: "Alice Johnson",
        email: "alice@example.com",
        subject: "general",
      },
      submitAdapter: {
        name: "mock",
        async submit(response) {
          console.log("Form submitted:", response);
          alert(`Form submitted successfully!`);
        },
      },
    });

    return <FormRenderer engine={engine} />;
  },
};

export const ReadOnly: Story = {
  render: () => {
    const engine = useFormEngine({
      schema: contactFormSchema,
      initialValues: {
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 (555) 123-4567",
        subject: "support",
        message: "I need help with my account.",
        newsletter: true,
      },
      disabled: true,
      submitAdapter: {
        name: "mock",
        async submit() {},
      },
    });

    return <FormRenderer engine={engine} />;
  },
};
