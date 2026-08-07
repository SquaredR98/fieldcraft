let fontsCache: { display: ArrayBuffer; mono: ArrayBuffer } | null = null;

export async function getOgFonts() {
  if (fontsCache) return fontsCache;

  const [displayRes, monoRes] = await Promise.all([
    fetch(
      'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600&display=swap',
    ).then((r) => r.text()),
    fetch(
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap',
    ).then((r) => r.text()),
  ]);

  const extractUrl = (css: string) => {
    const match = css.match(/url\(([^)]+)\)/);
    return match?.[1] ?? '';
  };

  const [display, mono] = await Promise.all([
    fetch(extractUrl(displayRes)).then((r) => r.arrayBuffer()),
    fetch(extractUrl(monoRes)).then((r) => r.arrayBuffer()),
  ]);

  fontsCache = { display, mono };
  return fontsCache;
}
