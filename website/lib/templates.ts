import { allTemplates } from '@squaredr/fieldcraft-templates';
import type { Template, TemplateMeta, TemplateCategory } from '@squaredr/fieldcraft-templates';

export type { Template, TemplateMeta, TemplateCategory };

export function getAllTemplates(): Template[] {
  return allTemplates;
}

export function getTemplateById(id: string): Template | undefined {
  return allTemplates.find((t) => t.meta.id === id);
}

export function getAllTemplateIds(): string[] {
  return allTemplates.map((t) => t.meta.id);
}

export function getTemplatesByCategory(): Record<TemplateCategory, Template[]> {
  const grouped: Partial<Record<TemplateCategory, Template[]>> = {};
  for (const t of allTemplates) {
    if (!grouped[t.meta.category]) grouped[t.meta.category] = [];
    grouped[t.meta.category]!.push(t);
  }
  return grouped as Record<TemplateCategory, Template[]>;
}

export const categoryLabels: Record<TemplateCategory, string> = {
  general: 'General',
  feedback: 'Feedback',
  marketing: 'Marketing',
  support: 'Support',
  hr: 'Human Resources',
  ecommerce: 'E-Commerce',
  healthcare: 'Healthcare',
};

export const categoryOrder: TemplateCategory[] = [
  'general', 'feedback', 'marketing', 'support', 'hr', 'ecommerce', 'healthcare',
];
