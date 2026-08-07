'use client';

import { useSyncExternalStore } from 'react';
import { draftingTealTheme, draftingTealDarkTheme } from './drafting-teal-theme';
import type { FormEngineTheme } from '@squaredr/fieldcraft-core';

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): FormEngineTheme {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? draftingTealDarkTheme : draftingTealTheme;
}

function getServerSnapshot(): FormEngineTheme {
  return draftingTealTheme;
}

/** Returns the Drafting Teal FormEngineTheme matching the current site theme. */
export function useSiteTheme(): FormEngineTheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
