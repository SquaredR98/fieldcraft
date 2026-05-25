// Dev console banner — runs once in development mode
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  const _fc_banner = `\n%c FieldCraft Supabase %c v1.1.0 \n\n%cField-level encryption · RLS · Schema CRUD\n\nDocs    → https://squaredr.tech/products/fieldcraft/docs/adapters\nDiscord → https://discord.gg/YOUR_INVITE_LINK\n`;
  console.log(
    _fc_banner,
    "background:#2563eb;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px",
    "background:#1e40af;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0",
    "color:#6b7280"
  );
}

export { createSupabaseAdapter } from "./supabase-adapter";
export { createSupabaseDraftAdapter } from "./supabase-draft-adapter";
export { createSupabaseSchemaAdapter } from "./supabase-schema-adapter";
export { encryptFields, decryptFields } from "./encryption";
export type {
  SupabaseAdapterConfig,
  SupabaseDraftAdapterConfig,
  SupabaseSchemaAdapterConfig,
  SupabaseClient,
} from "./types";
