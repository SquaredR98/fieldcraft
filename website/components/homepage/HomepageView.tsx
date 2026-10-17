import { Hero } from '@/components/homepage/Hero';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { BatteriesIncluded } from '@/components/homepage/BatteriesIncluded';
import { LiveDemos } from '@/components/homepage/LiveDemos';
import { Architecture } from '@/components/homepage/Architecture';
import { TemplateShowcase } from '@/components/homepage/TemplateShowcase';
import { KnownGaps } from '@/components/homepage/KnownGaps';
import { Status } from '@/components/homepage/Status';
import { FinalCta } from '@/components/homepage/FinalCta';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import type { Template } from '@/lib/templates';
import './v2.css';

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
      <Hero version={latestVersion} />
      {/* Quick start leads. The hero shows THAT it works; this answers
          the question it leaves open — what you actually type.

          DataFlow and TrustStrip were here and are gone. DataFlow argued
          data sovereignty ("most form tools put themselves in the path"),
          which is not a differentiator for an npm library — every library
          a developer installs works that way, so claiming it suggests we
          think they do not know what a library is. It is a real argument
          for a hosted product, and belongs there if SaaS ships.
          TrustStrip went with it: its heading was "Don't take the last
          section on faith", so it was the audit trail for exactly that
          claim, and its four points (no endpoint of ours, telemetry off
          by default, MIT) are the same baseline-not-USP problem. */}
      <ScrollReveal><HowItWorks /></ScrollReveal>
      <ScrollReveal><BatteriesIncluded /></ScrollReveal>
      <ScrollReveal><LiveDemos /></ScrollReveal>
      <ScrollReveal><Architecture /></ScrollReveal>
      {/* FormBuilderTeaser removed: Pro is hidden from the site until the
          OSS stands on its own. The component is kept, not deleted, so it
          can come back when Pro is ready. */}
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
