import { nanoid } from "nanoid";

export function createId() {
  return nanoid();
}

export default {
  createId,
};
