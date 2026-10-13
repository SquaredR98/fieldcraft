/**
 * Deprecation notices for field types leaving the OSS package.
 *
 * Fires once per type per session, in development only. A warning that repeats
 * on every render is noise the developer learns to ignore, and one that ships
 * to a production console is noise their users' devtools inherit.
 *
 * @since 1.11.0
 */

/**
 * Removal date for every type listed here. Date-based rather than
 * version-based so it holds even if the major release slips — it is a promise
 * to users, not a release note.
 */
export const DEPRECATION_REMOVAL_DATE = "2027-07-01";

/**
 * Field types scheduled for removal from `@squaredr/fieldcraft-react`.
 *
 * Both reasons given in the warning are checkable, which is the point — a
 * developer should be able to verify the claim rather than take it on trust:
 *
 * - **Unused across all 16 shipped templates.** Verified by grepping
 *   `packages/templates/src` for each type; zero occurrences.
 * - **13 of the 19 have broken label association** — `FieldWrapper` emits
 *   `<Label htmlFor={field.id}>` while the component sets no matching `id`,
 *   so the label points at an element that does not exist. Verified by
 *   checking which components never call `fieldAria()`.
 */
export const DEPRECATED_FIELD_TYPES = new Set([
  // Commercial set
  "signature",
  "payment",
  "matrix",
  "image_capture",
  // Expensive to build
  "appointment",
  "file_upload",
  "address",
  "repeater",
  "ranking",
  "scoring",
  // Finished work, but unused
  "phone_international",
  "legal_name",
  "country_select",
  "date_range",
  "time",
  "slider",
  // Content / presentation
  "welcome-screen",
  "image",
  "video",
]);

/**
 * `rich-text` is removed rather than relocated, because it has a replacement
 * that is strictly better: formatting on the question itself via
 * `labelFormat` / `helpTextFormat` / `contentFormat`.
 *
 * A separate block is unrelated content to a screen reader, vanishes in
 * conversational mode, and stays behind when the question is reordered. A
 * formatted label travels with its question and stays bound to the input.
 */
export const REPLACED_FIELD_TYPES: Record<string, string> = {
  "rich-text":
    'Use "labelFormat" / "helpTextFormat" on the question, or "contentFormat" ' +
    "on an info_block. Formatting belongs on the text it formats: a separate " +
    "block is unrelated content to a screen reader, disappears in " +
    "conversational mode, and is left behind when the question moves.",
};

const warned = new Set<string>();

function isDev(): boolean {
  // Mirrors core's approach. Guarded against every access because a bundler
  // may leave `process` undefined in a browser build.
  try {
    return (
      typeof globalThis !== "undefined" &&
      typeof (globalThis as { process?: { env?: Record<string, string> } }).process !==
        "undefined" &&
      (globalThis as { process?: { env?: Record<string, string> } }).process?.env
        ?.NODE_ENV !== "production"
    );
  } catch {
    return false;
  }
}

/**
 * Warns once, in development, that a field type is scheduled for removal.
 *
 * Deliberately says nothing about where the field goes next. A deprecation
 * notice that points at a paid product reads as a sales tactic even when it
 * is not, and the free escape hatch below is the option most consumers
 * actually want.
 */
export function warnIfDeprecated(fieldType: string): void {
  if (!isDev() || warned.has(fieldType)) return;

  const replacement = REPLACED_FIELD_TYPES[fieldType];
  if (!replacement && !DEPRECATED_FIELD_TYPES.has(fieldType)) return;

  warned.add(fieldType);

  if (replacement) {
    console.warn(
      `[FieldCraft] The "${fieldType}" field type is deprecated and will be ` +
        `removed from @squaredr/fieldcraft-react on ${DEPRECATION_REMOVAL_DATE}.\n\n` +
        `Nothing breaks before then.\n\n` +
        `${replacement}\n\n` +
        `Full list and notes: https://fieldcraft.squaredr.tech/docs/deprecations`,
    );
    return;
  }

  console.warn(
    `[FieldCraft] The "${fieldType}" field type is deprecated and will be ` +
      `removed from @squaredr/fieldcraft-react on ${DEPRECATION_REMOVAL_DATE}.\n\n` +
      `Nothing breaks before then.\n\n` +
      `Why: it is unused across all 16 shipped templates, and 13 of the 19 ` +
      `fields being removed have broken label association — a label pointing ` +
      `at an element that does not exist. Fixing and then maintaining that for ` +
      `fields nobody uses costs more than it returns. A smaller set where ` +
      `every field works beats a larger set where some do not.\n\n` +
      `To keep it after that date, register it yourself:\n\n` +
      `    import { createFieldRegistry } from "@squaredr/fieldcraft-react";\n` +
      `    const components = createFieldRegistry({ ${fieldType}: MyComponent });\n\n` +
      `FieldProps and FieldComponent are public API, and QuestionType accepts ` +
      `any string, so this keeps working after removal.\n\n` +
      `Full list and notes: https://fieldcraft.squaredr.tech/docs/deprecations`,
  );
}

/** Resets the once-per-session guard. Testing only. */
export function __resetDeprecationWarnings(): void {
  warned.clear();
}
