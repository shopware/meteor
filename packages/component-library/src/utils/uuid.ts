function uuidv4() {
  // @ts-expect-error
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

/**
 * Returns a uuid string in hex format.
 *
 * @returns {String}
 */
export function createId() {
  // eslint-disable-next-line max-len
  return uuidv4().replace(/-/g, "");
}

export default {
  createId,
};
