import { expect, test as fact } from "vitest";
import { CSSDeliverable } from "./CSSDeliverable";
import { Dictionary } from "../dictionary";
import { FigmaApiResponse } from "../figmaApi";

fact('creates a CSSDeliverable with the default selector of ":root"', () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        "VariableID:11953:115880": {
          id: "VariableID:11953:115880",
          name: "blue",
          key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
          variableCollectionId: "VariableCollectionId:11953:115879",
          resolvedType: "COLOR",
          valuesByMode: {
            "11953:0": {
              r: 0,
              g: 0,
              b: 1,
              a: 1,
            },
          },
          remote: false,
          description: "",
          hiddenFromPublishing: false,
          scopes: ["ALL_SCOPES"],
        },
      },
      variableCollections: {
        "VariableCollectionId:11953:115879": {
          id: "VariableCollectionId:11953:115879",
          name: ".Design Tokens",
          key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
          modes: [{ modeId: "11953:0", name: "Default" }],
          defaultModeId: "11953:0",
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ["VariableID:11953:115880"],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: "Default",
  });

  // WHEN
  const subject = CSSDeliverable.fromDictionary(dictionary);
  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --blue: #0000ff;
    }"
  `);
});

fact("creates a CSSDeliverable with a custom selector", () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        "VariableID:11953:115880": {
          id: "VariableID:11953:115880",
          name: "blue",
          key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
          variableCollectionId: "VariableCollectionId:11953:115879",
          resolvedType: "COLOR",
          valuesByMode: {
            "11953:0": {
              r: 0,
              g: 0,
              b: 1,
              a: 1,
            },
          },
          remote: false,
          description: "",
          hiddenFromPublishing: false,
          scopes: ["ALL_SCOPES"],
        },
      },
      variableCollections: {
        "VariableCollectionId:11953:115879": {
          id: "VariableCollectionId:11953:115879",
          name: ".Design Tokens",
          key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
          modes: [{ modeId: "11953:0", name: "Default" }],
          defaultModeId: "11953:0",
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ["VariableID:11953:115880"],
        },
      },
    },
  };
  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: "Default",
  });

  // WHEN
  const subject = CSSDeliverable.fromDictionary(dictionary, {
    selector: '[data-theme="dark"]',
  });

  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    "[data-theme=\"dark\"] {
      --blue: #0000ff;
    }"
  `);
});

fact("creates a CSSDeliverable with nested tokens", () => {
  // GIVEN
  const response: FigmaApiResponse = {
    status: 200,
    error: false,
    meta: {
      variables: {
        "VariableID:11953:115880": {
          id: "VariableID:11953:115880",
          name: "Zinc/50",
          key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
          variableCollectionId: "VariableCollectionId:11953:115879",
          resolvedType: "COLOR",
          valuesByMode: {
            "11953:0": {
              r: 0.9803921580314636,
              g: 0.9843137264251709,
              b: 0.9960784316062927,
              a: 1,
            },
          },
          remote: false,
          description: "",
          hiddenFromPublishing: false,
          scopes: ["ALL_SCOPES"],
        },
      },
      variableCollections: {
        "VariableCollectionId:11953:115879": {
          id: "VariableCollectionId:11953:115879",
          name: ".Design Tokens",
          key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
          modes: [{ modeId: "11953:0", name: "Default" }],
          defaultModeId: "11953:0",
          remote: false,
          hiddenFromPublishing: true,
          variableIds: ["VariableID:11953:115880"],
        },
      },
    },
  };

  const dictionary = Dictionary.fromFigmaApiResponse(response, {
    mode: "Default",
  });

  // WHEN
  const subject = CSSDeliverable.fromDictionary(dictionary);
  const result = subject.toString();

  // THEN
  expect(result).toMatchInlineSnapshot(`
    ":root {
      --zinc-50: #fafbfe;
    }"
  `);
});
