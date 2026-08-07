'use client';

import { FormBuilder, DEFAULT_SCHEMA } from '@squaredr/fieldcraft-pro/form-builder';
import { FieldCraftProProvider } from '@squaredr/fieldcraft-pro';
import { useBuilderSiteTheme } from '@/lib/use-builder-theme';
import '@squaredr/fieldcraft-pro/styles.css';

export function FormBuilderTeaserClient() {
  const theme = useBuilderSiteTheme();

  return (
    <FieldCraftProProvider licenseKey={process.env.NEXT_PUBLIC_FC_PRO_KEY ?? ''}>
      <FormBuilder
        initialSchema={DEFAULT_SCHEMA}
        height="600px"
        theme={theme}
      />
    </FieldCraftProProvider>
  );
}
