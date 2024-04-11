function isNode() {
  return typeof process !== "undefined" && !!process.versions && !!process.versions.node;
}

export function createId() {
  const crypto = isNode() ? require("crypto") : window.crypto;

  return crypto.randomUUID();
}

export default {
  createId,
};
