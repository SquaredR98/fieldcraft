export type PackageStat = {
  name: string;
  shortName: string;
  downloads: number;
  npmUrl: string;
  installCmd: string;
};

export type NpmStatsData = {
  packages: PackageStat[];
  totalMonthly: number;
};

const PACKAGES = [
  { name: '@squaredr/fieldcraft-core', shortName: 'core' },
  { name: '@squaredr/fieldcraft-react', shortName: 'react' },
  { name: '@squaredr/fieldcraft-adapters', shortName: 'adapters' },
  { name: '@squaredr/fieldcraft-templates', shortName: 'templates' },
  { name: '@squaredr/fieldcraft-pro', shortName: 'pro' },
];

/** Fallback values if the npm API is unreachable at build time. */
const FALLBACK_DOWNLOADS: Record<string, number> = {
  '@squaredr/fieldcraft-core': 359,
  '@squaredr/fieldcraft-react': 493,
  '@squaredr/fieldcraft-adapters': 54,
  '@squaredr/fieldcraft-templates': 60,
  '@squaredr/fieldcraft-pro': 260,
};

async function fetchMonthlyDownloads(packageName: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) return FALLBACK_DOWNLOADS[packageName] ?? 0;

    const data = await res.json();
    return data.downloads ?? FALLBACK_DOWNLOADS[packageName] ?? 0;
  } catch {
    return FALLBACK_DOWNLOADS[packageName] ?? 0;
  }
}

/** Fetch monthly download stats for all FieldCraft packages. */
export async function getNpmStats(): Promise<NpmStatsData> {
  const results = await Promise.all(
    PACKAGES.map(async (pkg) => {
      const downloads = await fetchMonthlyDownloads(pkg.name);
      return {
        name: pkg.name,
        shortName: pkg.shortName,
        downloads,
        npmUrl: `https://www.npmjs.com/package/${pkg.name}`,
        installCmd: `npm i ${pkg.name}`,
      };
    }),
  );

  const totalMonthly = results.reduce((sum, pkg) => sum + pkg.downloads, 0);

  return { packages: results, totalMonthly };
}
