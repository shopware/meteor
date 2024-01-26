import { Dictionary } from "../dictionary";
import { Deliverable } from "./Deliverable";

export class CSSDeliverable implements Deliverable {
  public static fromDictionary(dictionary: Dictionary): Deliverable {
    throw new Error("Method not implemented.");
  }

  toString(): string {
    throw new Error("Method not implemented.");
  }
}
