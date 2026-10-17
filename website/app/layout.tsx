import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { CookieConsent } from '@/components/layout/CookieConsent';
import './globals.css';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fieldcraft.squaredr.tech'),
  title: {
    default: 'FieldCraft — Schema-driven form engine for React',
    template: '%s | FieldCraft',
  },
  description:
    'A self-hosted form engine for React. Define a form once in JSON — validation, conditional logic, multi-step navigation, drafts and submission are handled.',
  keywords: [
    'form engine',
    'react forms',
    'json schema forms',
    'form builder',
    'typescript',
    'multi-step forms',
    'conditional logic',
    'form validation',
  ],
  authors: [{ name: 'SquaredR' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fieldcraft.squaredr.tech',
    siteName: 'FieldCraft',
    title: 'FieldCraft — Schema-driven form engine for React',
    description:
      'Define a form once in JSON — 34 input field types, conditional logic, multi-step navigation, validation, and submission. Open source, MIT licensed.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FieldCraft — Schema-driven form engine for React',
    description:
      'Define a form once in JSON — 34 input field types, conditional logic, multi-step navigation, validation, and submission. Open source, MIT licensed.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});try{if(document.cookie.indexOf('fc_consent=granted')>-1){gtag('consent','update',{'analytics_storage':'granted'})}}catch(e){}`,
          }}
        />
        {/*
          Staged entrance for the page furniture.

          `fc-js` is set SYNCHRONOUSLY, before first paint. Nothing is
          hidden by CSS unless this class exists, so a browser with
          JavaScript off, blocked, or still downloading shows the full
          page — the hidden state is opt-in and can never strand content.

          `fc-ready` lands after the browser has actually painted, via a
          double requestAnimationFrame: the first callback runs before
          the paint, the second after it. That is the cheap, accurate way
          to say "after first contentful paint" without measuring
          anything, and it keeps the hero's own text out of the
          animation entirely — it paints immediately and is the LCP
          element.

          Inline and tiny on purpose: no bundle, no network round trip,
          no hydration pass. The animations themselves are pure CSS on
          opacity and transform, which are composited and never touch the
          main thread.
        */}
        <Script
          id="fc-stage"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;d.classList.add('fc-js');requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('fc-ready')})})}catch(e){}`,
          }}
        />
      </head>
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body>
        <RootProvider
          theme={{
            attribute: 'data-theme',
            storageKey: 'fieldcraft-theme',
            defaultTheme: 'system',
            enableSystem: true,
          }}
        >
          {children}
          <CookieConsent />
        </RootProvider>
      </body>
    </html>
  );
}
