import { Color } from "./Color";
import {
  FigmaApi,
  FigmaApiResponse,
  type FigmaVariable,
  type FigmaVariableCollection,
} from "./figmaApi";
import { set } from "./utils/object";

type DictionaryValue = {
  $value: string;

  // TODO: are we able to make a union of all possible types?
  $type: string;
};

type DictionaryTree = {
  [key: string]: DictionaryValue | DictionaryTree;
};

export class Dictionary {
  // TODO: use inferred type from zod schema
  private constructor(public readonly value: DictionaryTree) {
    // TODO: add zod validation
  }

  public static fromFigmaApiResponse(
    // TODO: use inferred type from zod schema
    response: FigmaApiResponse
  ): Dictionary {
    const collections = Object.values(response.meta.variableCollections);
    const variables = Object.values(response.meta.variables);

    const modes = collections.reduce<{ modeId: string; name: string }[]>(
      (accumulator, collection) => {
        const uniqueModes = collection.modes.filter(
          (mode) => !accumulator.some((m) => m.modeId === mode.modeId)
        );

        accumulator.push(...uniqueModes);

        return accumulator;
      },
      []
    );

    if (modes.length < 2) {
      const tokens = variables.reduce((accumulator, variable) => {
        const collection = collections.find(
          (collection) => collection.id === variable.variableCollectionId
        );

        if (!collection)
          throw new Error(
            `Failed to create dictionary: Could not find collection for variable with id: ${variable.id}`
          );

        if (collection.modes.length === 1) {
          const rawValue = variable.valuesByMode[collection.modes[0].modeId];
          const itIsAnAliasedToken =
            typeof rawValue === "object" &&
            "type" in rawValue &&
            rawValue.type === "VARIABLE_ALIAS";

          if (itIsAnAliasedToken) {
            const path = variable.name
              .replace(/\//g, ".")
              .replace(/ /g, "")
              .toLowerCase();

            const referencedVariable = variables.find(
              (variable) => variable.id === rawValue.id
            );

            const referencedVariableDoesNotExist = !referencedVariable;
            if (referencedVariableDoesNotExist)
              throw new Error(
                `Failed to create dictionary: Referenced variable with id "${rawValue.id}" does not exist`
              );

            set(accumulator, path, {
              $value: `{${referencedVariable.name
                .replace(/\//g, ".")
                .replace(/ /g, "")
                .toLowerCase()}}`,
              $type: variable.resolvedType.toLowerCase(),
            });

            return accumulator;
          }

          const itIsAColorValue =
            typeof rawValue === "object" && "r" in rawValue;

          if (itIsAColorValue) {
            // TODO: should we validate that the naming convention is followed? and if yes where? here or in the figmaApi?
            const path = variable.name
              .replace(/\//g, ".")
              .replace(/ /g, "")
              .toLowerCase();

            set(accumulator, path, {
              $value: Color.fromRGB(
                rawValue.r * 255,
                rawValue.g * 255,
                rawValue.b * 255,
                rawValue.a
              ).toHex(),
              $type: variable.resolvedType.toLowerCase(),
            });
          }

          return accumulator;
        }

        throw new Error(
          "Failed to create dictionary: Value is not a color value"
        );
      }, {});

      return new Dictionary(tokens);
    }

    return new Dictionary({});
  }
}
