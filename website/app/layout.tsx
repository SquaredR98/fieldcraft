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
      'Define a form once in JSON — 44 field types, conditional logic, multi-step navigation, validation, and submission. Open source, MIT licensed.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FieldCraft — Schema-driven form engine for React',
    description:
      'Define a form once in JSON — 44 field types, conditional logic, multi-step navigation, validation, and submission. Open source, MIT licensed.',
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
