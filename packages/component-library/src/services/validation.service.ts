/**
 * Checks if a value is set based on its type.
 */
export function required(value: unknown): boolean {
  if (typeof value === "string" && value.length <= 0) {
    return false;
  }

  if (typeof value === "boolean") {
    return value === true;
  }

  if (value instanceof Object) {
    return Object.keys(value).length > 0;
  }

  return typeof value !== "undefined" && value !== null;
}

/**
 * Checks the value against the given regular expression.
 */
export function regex(value: string, expression: RegExp | string): boolean {
  if (expression instanceof RegExp) {
    return expression.test(value);
  }

  return new RegExp(expression).test(value);
}

/**
 * Checks if the value is a valid email address.
 */
export function email(value: string): boolean {
  const emailValidation =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex(value, emailValidation);
}

export default {
  required,
  regex,
  email,
};
