import crypto from "node:crypto";

/** Sign a JSON payload string with HMAC-SHA256. Returns hex digest. */
export function signPayload(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}
