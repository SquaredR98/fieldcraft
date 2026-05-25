// Dev console banner — runs once in development mode
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  const _fc_banner = `\n%c FieldCraft Postgres %c v1.0.2 \n\n%cDrizzle ORM · AES-256-GCM encryption\n\nDocs    → https://squaredr.tech/products/fieldcraft/docs/adapters\nDiscord → https://discord.gg/zMxdu5UVW\n`;
  console.log(
    _fc_banner,
    "background:#2563eb;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px",
    "background:#1e40af;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0",
    "color:#6b7280"
  );
}

export { createPostgresAdapter } from "./postgres-adapter";
export { createPostgresDraftAdapter } from "./postgres-draft-adapter";
export { encrypt, decrypt } from "./encryption";
export type {
  PostgresAdapterConfig,
  PostgresDraftAdapterConfig,
} from "./types";
