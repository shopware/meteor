import { optional } from "zod";
import { Dictionary } from "../dictionary";
import { Deliverable } from "./Deliverable";

type Options = {
  selector: string;
};

export class CSSDeliverable implements Deliverable {
  constructor(
    private readonly dictionary: Dictionary,
    private readonly options: Options
  ) {}

  public static fromDictionary(
    dictionary: Dictionary,
    options: Options = { selector: ":root" }
  ): Deliverable {
    return new this(dictionary, options);
  }

  toString(): string {
    const cssVariables: string[] = [];

    const processToken = (token: any, prefix: string = "") => {
      if (typeof token === "object" && token !== null) {
        for (const key in token) {
          if (token.hasOwnProperty(key)) {
            const value = token[key];
            const variableName = `${prefix}${key}`.replace("-$value", "");

            if (typeof value === "object" && value !== null) {
              processToken(value, `${variableName}-`);
            } else if (typeof value === "string" && key !== "$type") {
              cssVariables.push(`--${variableName}: ${value};`);
            }
          }
        }
      }
    };

    processToken(this.dictionary.value);

    return `${this.options.selector} {
  ${cssVariables.join("\n")}
}`;
  }
}
