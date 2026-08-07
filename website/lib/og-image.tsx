import { ImageResponse } from 'next/og';
import { getOgFonts } from './og-fonts';

/* ── Drafting Teal dark palette ── */
const BG = '#0F1A1F';
const SURFACE = '#16242A';
const INK = '#E8EFF1';
const MUTED = '#8CA1A9';
const RULE = '#2A3B42';
const TEAL = '#63BDB4';
const AMBER = '#E0A94F';

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Three-bar logo mark (outlined teal, filled teal, outlined amber).
 */
function LogoMark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          width: 36,
          height: 8,
          border: `2px solid ${TEAL}`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          width: 36,
          height: 8,
          background: TEAL,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          width: 36,
          height: 8,
          border: `2px solid ${AMBER}`,
          borderRadius: 2,
        }}
      />
    </div>
  );
}

/**
 * Generates a Drafting Teal OG image.
 *
 * Layout:
 *   ┌───────────────────────────────────────────────┐
 *   │  Logo mark                                    │
 *   │                                               │
 *   │  EYEBROW                                      │
 *   │  Title text (large)                           │
 *   │                                               │
 *   │  Description text (smaller, muted)            │
 *   │                                               │
 *   │  ─────── hairline ───────                     │
 *   │  fieldcraft.squaredr.tech                     │
 *   └───────────────────────────────────────────────┘
 */
export async function generateOgImage(options: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const fonts = await getOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          padding: '60px 80px',
        }}
      >
        {/* Top: logo mark */}
        <LogoMark />

        {/* Center: text content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {options.eyebrow && (
            <div
              style={{
                fontFamily: '"IBM Plex Mono"',
                fontSize: 14,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: TEAL,
                marginBottom: 16,
              }}
            >
              {options.eyebrow}
            </div>
          )}

          <div
            style={{
              fontFamily: '"Space Grotesk"',
              fontSize: options.title.length > 40 ? 48 : 56,
              fontWeight: 600,
              color: INK,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 900,
            }}
          >
            {options.title}
          </div>

          {options.description && (
            <div
              style={{
                fontFamily: '"Space Grotesk"',
                fontSize: 22,
                color: MUTED,
                lineHeight: 1.5,
                marginTop: 20,
                maxWidth: 750,
              }}
            >
              {options.description}
            </div>
          )}
        </div>

        {/* Bottom: hairline + URL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ height: 1, background: RULE, width: '100%' }} />
          <div
            style={{
              fontFamily: '"IBM Plex Mono"',
              fontSize: 14,
              letterSpacing: '0.08em',
              color: MUTED,
            }}
          >
            fieldcraft.squaredr.tech
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Space Grotesk', data: fonts.display, weight: 600 },
        { name: 'IBM Plex Mono', data: fonts.mono, weight: 500 },
      ],
    },
  );
}
