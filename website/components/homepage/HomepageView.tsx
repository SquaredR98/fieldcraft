import { Hero } from '@/components/homepage/Hero';
import { DataFlow } from '@/components/homepage/DataFlow';
import { TrustStrip } from '@/components/homepage/TrustStrip';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { BatteriesIncluded } from '@/components/homepage/BatteriesIncluded';
import { LiveDemos } from '@/components/homepage/LiveDemos';
import { Architecture } from '@/components/homepage/Architecture';
import { FormBuilderTeaser } from '@/components/homepage/FormBuilderTeaser';
import { TemplateShowcase } from '@/components/homepage/TemplateShowcase';
import { KnownGaps } from '@/components/homepage/KnownGaps';
import { Status } from '@/components/homepage/Status';
import { FinalCta } from '@/components/homepage/FinalCta';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import type { Template } from '@/lib/templates';
import './v2.css';

/*
 * Order carries the argument:
 *   1. the claim               (Hero)
 *   2. why it is structural    (DataFlow)
 *   3. what follows from it    (TrustStrip)
 *   4. then capability         (HowItWorks → Batteries → Demos → Architecture)
 *   5. then the paid tier      (FormBuilderTeaser → Templates)
 *   6. then the limits         (Scope → Status)
 *
 * The founder narrative lives at /about. Scope stays here on purpose:
 * it is what makes everything above it credible.
 */

interface HomepageViewProps {
  showcaseTemplates: Template[];
  templateCount: number;
  latestVersion: string;
  latestDate: string;
  latestPackage: string;
}

export function HomepageView({
  showcaseTemplates,
  templateCount,
  latestVersion,
  latestDate,
  latestPackage,
}: HomepageViewProps) {
  return (
    <>
      <Hero />
      <ScrollReveal><DataFlow /></ScrollReveal>
      <ScrollReveal><TrustStrip /></ScrollReveal>
      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><BatteriesIncluded /></ScrollReveal>
      <ScrollReveal><LiveDemos /></ScrollReveal>
      <ScrollReveal><Architecture /></ScrollReveal>
      <ScrollReveal><FormBuilderTeaser /></ScrollReveal>
      <ScrollReveal><TemplateShowcase templates={showcaseTemplates} total={templateCount} /></ScrollReveal>
      <ScrollReveal><KnownGaps /></ScrollReveal>
      <ScrollReveal>
        <Status
          latestVersion={latestVersion}
          latestDate={latestDate}
          latestPackage={latestPackage}
        />
      </ScrollReveal>
      <ScrollReveal><FinalCta /></ScrollReveal>
    </>
  );
}
