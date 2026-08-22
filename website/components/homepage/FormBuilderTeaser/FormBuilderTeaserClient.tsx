'use client';

import { FormBuilder, DEFAULT_SCHEMA } from '@squaredr/fieldcraft-pro/form-builder';
import { FieldCraftProProvider } from '@squaredr/fieldcraft-pro';
import '@squaredr/fieldcraft-pro/styles.css';

export function FormBuilderTeaserClient() {
  return (
    <FieldCraftProProvider licenseKey={process.env.NEXT_PUBLIC_FC_PRO_KEY ?? ''}>
      <FormBuilder
        initialSchema={DEFAULT_SCHEMA}
        height="600px"
      />
    </FieldCraftProProvider>
  );
}
