'use client';

import { useSyncExternalStore } from 'react';
import { builderLightTheme, builderDarkTheme } from './builder-theme';
import type { FormBuilderTheme } from '@squaredr/fieldcraft-pro/form-builder';

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): FormBuilderTheme {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? builderDarkTheme : builderLightTheme;
}

function getServerSnapshot(): FormBuilderTheme {
  return builderLightTheme;
}

/** Returns the Drafting Teal FormBuilderTheme matching the current site theme. */
export function useBuilderSiteTheme(): FormBuilderTheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
