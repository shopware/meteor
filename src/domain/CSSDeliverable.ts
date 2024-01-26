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
    const cssVariables = Object.entries(this.dictionary.value).map(
      ([tokenName, tokenValue]) => {
        const cssVariableName = `--${tokenName}`;

        return `${cssVariableName}: ${tokenValue.$value};`;
      }
    );

    return `${this.options.selector} {
  ${cssVariables.join("\n")}
}`;
  }
}
