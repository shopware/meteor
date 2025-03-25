import crypto from "node:crypto";

export function md5(input: unknown) {
  return crypto.createHash("md5").update(JSON.stringify(input)).digest("hex");
}
