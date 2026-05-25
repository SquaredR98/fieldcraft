// Dev console banner — runs once in development mode
if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
  const _fc_banner = `\n%c FieldCraft Webhook %c v1.0.0 \n\n%cHMAC-SHA256 signing · Exponential backoff with jitter\n\nDocs    → https://squaredr.tech/products/fieldcraft/docs/adapters\nDiscord → https://discord.gg/YOUR_INVITE_LINK\n`;
  console.log(
    _fc_banner,
    "background:#2563eb;color:#fff;font-weight:bold;padding:2px 6px;border-radius:3px 0 0 3px",
    "background:#1e40af;color:#fff;padding:2px 6px;border-radius:0 3px 3px 0",
    "color:#6b7280"
  );
}

export { createWebhookAdapter } from "./webhook-adapter";
export { signPayload } from "./signer";
export { calculateDelay, sleep } from "./retry";
export type { WebhookAdapterConfig } from "./types";
