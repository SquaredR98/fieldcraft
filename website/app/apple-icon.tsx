import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F1A1F',
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {/* Top bar: outlined teal */}
          <div
            style={{
              width: 100,
              height: 22,
              border: '3px solid #63BDB4',
              borderRadius: 3,
            }}
          />
          {/* Middle bar: filled teal */}
          <div
            style={{
              width: 100,
              height: 22,
              background: '#63BDB4',
              borderRadius: 3,
            }}
          />
          {/* Bottom bar: outlined amber */}
          <div
            style={{
              width: 100,
              height: 22,
              border: '3px solid #E0A94F',
              borderRadius: 3,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
