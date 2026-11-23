/**
 * Console messages of the component library. Every message starts with `[Meteor]` and the
 * component, composable or directive it comes from, for example:
 *
 *   [Meteor] mt-app: The header and navigation slots are both filled. Use either one, not both.
 *
 * - `warn` and `deprecate` are for developers using a component in the wrong way. They show once
 *   per message and only in development.
 * - `logError` is for things that fail while the app runs, such as a request. It always shows.
 */

const PREFIX = "[Meteor]";

const shownWarnings = new Set<string>();

/**
 * Whether the app runs as a production build. The bundler of the app replaces
 * `process.env.NODE_ENV`; without a bundler, `process` doesn't exist and the library counts as
 * running in development.
 */
function isProduction() {
  try {
    return process.env.NODE_ENV === "production";
  } catch {
    return false;
  }
}

function format(source: string, message: string) {
  return `${PREFIX} ${source}: ${message}`;
}

/**
 * Warns developers that a component is used in a way it doesn't support. Shows once per message
 * and only in development. Say what is wrong and how to fix it.
 *
 * @param source The component, composable or directive, for example `mt-app` or `v-tooltip`.
 */
export function warn(source: string, message: string): void {
  if (isProduction()) return;

  const text = format(source, message);
  if (shownWarnings.has(text)) return;

  shownWarnings.add(text);
  console.warn(text);
}

/**
 * Warns developers that a prop, slot or option is deprecated. Shows once per message and only in
 * development.
 *
 * @param source The component, composable or directive, for example `mt-checkbox`.
 * @param name What is deprecated, for example "The `checked` prop".
 * @param replacement What to use instead, for example "`v-model`". Leave it out when there is none.
 */
export function deprecate(source: string, name: string, replacement?: string): void {
  warn(
    source,
    `${name} is deprecated and will be removed. ` +
      (replacement ? `Use ${replacement} instead.` : "There is no replacement."),
  );
}

/**
 * Logs something that failed while the app runs, such as a request. Always shows, also in
 * production and every time it happens.
 *
 * @param source The component, composable or directive, for example `mt-entity-select`.
 * @param error The error that was caught, if any.
 */
export function logError(source: string, message: string, error?: unknown): void {
  const text = format(source, message);

  if (error === undefined) console.error(text);
  else console.error(text, error);
}

/**
 * Lets every warning show again. Only for tests, which call it after each test.
 *
 * @internal
 */
export function resetWarnings(): void {
  shownWarnings.clear();
}
