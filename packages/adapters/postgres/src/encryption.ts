import crypto from "node:crypto";

const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function parseKey(keyBase64: string): Buffer {
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== 32) {
    throw new Error("Encryption key must be exactly 32 bytes (base64-encoded)");
  }
  return key;
}

/** Encrypt a plaintext string with AES-256-GCM. Returns base64(iv + ciphertext + authTag). */
export function encrypt(plaintext: string, keyBase64: string): string {
  const key = parseKey(keyBase64);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, encrypted, authTag]).toString("base64");
}

/** Decrypt a base64(iv + ciphertext + authTag) string with AES-256-GCM. */
export function decrypt(encoded: string, keyBase64: string): string {
  const key = parseKey(keyBase64);
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, IV_LENGTH);
  const authTag = buf.subarray(buf.length - AUTH_TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH, buf.length - AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext) + decipher.final("utf8");
}
