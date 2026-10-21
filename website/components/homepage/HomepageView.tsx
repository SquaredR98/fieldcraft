import { Hero } from '@/components/homepage/Hero';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { BatteriesIncluded } from '@/components/homepage/BatteriesIncluded';
import { LiveDemos } from '@/components/homepage/LiveDemos';
import { Architecture } from '@/components/homepage/Architecture';
import { TemplateShowcase } from '@/components/homepage/TemplateShowcase';
import { KnownGaps } from '@/components/homepage/KnownGaps';
import { Status } from '@/components/homepage/Status';
import { FinalCta } from '@/components/homepage/FinalCta';
import type { Template } from '@/lib/templates';

/*
 * Order carries the argument:
 *   1. what it is              (Hero — schema beside the form it renders)
 *   2. what you type           (HowItWorks)
 *   3. what it does for you    (Batteries → Demos → Architecture)
 *   4. what you can start from (Templates)
 *   5. what it does NOT do     (Scope → Status)
 *
 * The page opened on data sovereignty for a long time — a vendor-versus-
 * you data diagram, then a section auditing it. Both are gone: for an npm
 * library that argument is the baseline rather than a differentiator,
 * since every library a developer installs keeps their data local. It is
 * a real argument for a hosted product and belongs there instead.
 *
 * Scope stays here on purpose: it is what makes everything above it
 * credible.
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
      <Hero version={latestVersion} />
      {/* Quick start leads: the hero shows THAT it works, this shows
          what you actually type.

          No ScrollReveal wrapper. It hid each section behind a bare
          `opacity: 0` that only its IntersectionObserver could undo,
          so with JS off or still loading the page below the hero was
          invisible. */}
      <HowItWorks />
      <BatteriesIncluded />
      <LiveDemos />
      <Architecture />
      <TemplateShowcase templates={showcaseTemplates} total={templateCount} />
      <KnownGaps />
      <Status
        latestVersion={latestVersion}
        latestDate={latestDate}
        latestPackage={latestPackage}
      />
      <FinalCta />
    </>
  );
}
