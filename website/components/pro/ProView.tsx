import { ProHero } from '@/components/pro/ProHero';
import { ProProblem } from '@/components/pro/ProProblem';
import { ProBuilderDemo } from '@/components/pro/ProBuilderDemo';
import { ProResponseDemo } from '@/components/pro/ProResponseDemo';
import { ProThemeDemo } from '@/components/pro/ProThemeDemo';
import { ProFeatureGrid } from '@/components/pro/ProFeatureGrid';
import { ProCodeSnippet } from '@/components/pro/ProCodeSnippet';
import { ProPricing } from '@/components/pro/ProPricing';
import { ProContactFaq } from '@/components/pro/ProContactFaq';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export function ProView() {
  return (
    <>
      <ProHero />
      <ScrollReveal><ProProblem /></ScrollReveal>
      <ScrollReveal><ProBuilderDemo /></ScrollReveal>
      <ScrollReveal><ProResponseDemo /></ScrollReveal>
      <ScrollReveal><ProThemeDemo /></ScrollReveal>
      <ScrollReveal><ProFeatureGrid /></ScrollReveal>
      <ScrollReveal><ProCodeSnippet /></ScrollReveal>
      <ScrollReveal><ProPricing /></ScrollReveal>
      <ScrollReveal><ProContactFaq /></ScrollReveal>
    </>
  );
}
