// Drafting Teal — FieldCraft design tokens (TS mirror of tokens.css).
type ColorTokens = {
  bg: string; surface: string; surface2: string;
  ink: string; inkStrong: string; muted: string;
  rule: string; grid: string;
  teal: string; tealHover: string; tealOn: string; tealBorder: string;
  amber: string; amberInk: string; amberBg: string; amberBorder: string;
  wash: string; washRule: string;
  danger: string; btnLine: string;
  focusRing: string;
};

export const light: ColorTokens = {
  bg: '#F4F7F8', surface: '#FFFFFF', surface2: '#FAFCFC',
  ink: '#12222A', inkStrong: '#12222A', muted: '#6A7B85',
  rule: '#DCE4E8', grid: '#E3EAEC',
  teal: '#1F6B6E', tealHover: '#17575A', tealOn: '#FFFFFF', tealBorder: '#B9D1CF',
  amber: '#C98A2E', amberInk: '#A06D22', amberBg: '#FBF5EA', amberBorder: '#E2C795',
  wash: '#EDF3F2', washRule: '#D5E2DF',
  danger: '#B04A3C', btnLine: '#12222A',
  focusRing: '0 0 0 3px rgba(31,107,110,.14)',
};

export const dark: ColorTokens = {
  bg: '#0F1A1F', surface: '#16242A', surface2: '#132026',
  ink: '#E8EFF1', inkStrong: '#F0F5F6', muted: '#8CA1A9',
  rule: '#2A3B42', grid: '#1A2B32',
  teal: '#63BDB4', tealHover: '#7FCEC6', tealOn: '#0F1A1F', tealBorder: '#2F4F4C',
  amber: '#E0A94F', amberInk: '#E0A94F', amberBg: '#241F13', amberBorder: '#4D3F22',
  wash: '#182F31', washRule: '#24413F',
  danger: '#E08072', btnLine: '#3D5259',
  focusRing: '0 0 0 3px rgba(99,189,180,.18)',
};

export const font = {
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
} as const;

export const type = {
  h1:      { font: font.display, size: 60, weight: 600, leading: 1.0,  tracking: '-0.04em' },
  h2:      { font: font.display, size: 38, weight: 600, leading: 1.1,  tracking: '-0.03em' },
  cardH:   { font: font.display, size: 20, weight: 600, leading: 1.2,  tracking: '-0.02em' },
  bodyLg:  { font: font.body,    size: 17, weight: 400, leading: 1.6 },
  body:    { font: font.body,    size: 15, weight: 400, leading: 1.65 },
  label:   { font: font.body,    size: 12.5, weight: 600 },
  eyebrow: { font: font.mono,    size: 10.5, weight: 400, tracking: '0.16em', upper: true },
  micro:   { font: font.mono,    size: 10,   weight: 400, tracking: '0.12em', upper: true },
  code:    { font: font.mono,    size: 12,   weight: 400, leading: 1.8 },
} as const;

export const space = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;
export const radius = { sm: 2, md: 3, lg: 4, pill: 999 } as const;
export const layout = { contentMax: 1240, contentPad: 40, sectionPad: 80, gridCell: 24 } as const;
export const motion = { hover: '120ms linear', enter: '200ms ease-out', theme: '160ms ease' } as const;
