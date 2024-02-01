import { isObject } from 'lodash-es';

/**
 * Checks if a value is set based on its type.
 *
 * @param value
 * @returns {boolean}
 */
export function required(value) {
  if (typeof value === 'string' && value.length <= 0) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value === true;
  }

  if (isObject(value)) {
    return Object.keys(value).length > 0;
  }

  return typeof value !== 'undefined' && value !== null;
}

/**
 * Checks the value against the given regular expression.
 *
 * @param value
 * @param expression
 * @returns {boolean}
 */
export function regex(value, expression) {
  if (expression instanceof RegExp) {
    return expression.test(value);
  }

  return new RegExp(expression).test(value);
}

/**
 * Checks if the value is a valid email address.
 *
 * @param value
 * @returns {boolean}
 */
export function email(value) {
  // eslint-disable-next-line no-useless-escape
  const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex(value, emailValidation);
}

export default {
  required,
  regex,
  email,
};
