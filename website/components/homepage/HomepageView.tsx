import { Hero } from '@/components/homepage/Hero';
import { WhyIBuiltIt } from '@/components/homepage/WhyIBuiltIt';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { LiveDemos } from '@/components/homepage/LiveDemos';
import { Architecture } from '@/components/homepage/Architecture';
import { KnownGaps } from '@/components/homepage/KnownGaps';
import { WhatILearned } from '@/components/homepage/WhatILearned';
import { TemplateShowcase } from '@/components/homepage/TemplateShowcase';
import { Status } from '@/components/homepage/Status';
import { FinalCta } from '@/components/homepage/FinalCta';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import type { Template } from '@/lib/templates';

interface HomepageViewProps {
  showcaseTemplates: Template[];
  latestVersion: string;
  latestDate: string;
  latestPackage: string;
}

export function HomepageView({
  showcaseTemplates,
  latestVersion,
  latestDate,
  latestPackage,
}: HomepageViewProps) {
  return (
    <>
      <Hero />
      <ScrollReveal><WhyIBuiltIt /></ScrollReveal>
      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><LiveDemos /></ScrollReveal>
      <ScrollReveal><Architecture /></ScrollReveal>
      <ScrollReveal><KnownGaps /></ScrollReveal>
      <ScrollReveal><WhatILearned /></ScrollReveal>
      <ScrollReveal><TemplateShowcase templates={showcaseTemplates} /></ScrollReveal>
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
