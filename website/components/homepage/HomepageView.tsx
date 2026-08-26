import { Hero } from '@/components/homepage/Hero';
import { ProblemSection } from '@/components/homepage/ProblemSection';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Architecture } from '@/components/homepage/Architecture';
import { LiveDemos } from '@/components/homepage/LiveDemos';
import { BatteriesIncluded } from '@/components/homepage/BatteriesIncluded';
import { ProductionSchemas } from '@/components/homepage/ProductionSchemas';
import { TemplateShowcase } from '@/components/homepage/TemplateShowcase';
import { SubmissionPipeline } from '@/components/homepage/SubmissionPipeline';
import { TrustStrip } from '@/components/homepage/TrustStrip';
import { ComparisonTable } from '@/components/homepage/ComparisonTable';
import { NpmStats } from '@/components/homepage/NpmStats';
import { FormBuilderTeaser } from '@/components/homepage/FormBuilderTeaser';
import { Pricing } from '@/components/homepage/Pricing';
import { FinalCta } from '@/components/homepage/FinalCta';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import type { Template } from '@/lib/templates';
import type { NpmStatsData } from '@/lib/npm-stats';

interface HomepageViewProps {
  showcaseTemplates: Template[];
  npmStats: NpmStatsData;
}

export function HomepageView({ showcaseTemplates, npmStats }: HomepageViewProps) {
  return (
    <>
      <Hero />
      <ScrollReveal><ProblemSection /></ScrollReveal>
      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><Architecture /></ScrollReveal>
      <ScrollReveal><LiveDemos /></ScrollReveal>
      <ScrollReveal><BatteriesIncluded /></ScrollReveal>
      <ScrollReveal><ProductionSchemas /></ScrollReveal>
      <ScrollReveal><TemplateShowcase templates={showcaseTemplates} /></ScrollReveal>
      <ScrollReveal><SubmissionPipeline /></ScrollReveal>
      <ScrollReveal><TrustStrip /></ScrollReveal>
      <ScrollReveal><ComparisonTable /></ScrollReveal>
      <ScrollReveal><NpmStats stats={npmStats} /></ScrollReveal>
      <ScrollReveal><FormBuilderTeaser /></ScrollReveal>
      <ScrollReveal><Pricing /></ScrollReveal>
      <ScrollReveal><FinalCta /></ScrollReveal>
    </>
  );
}
