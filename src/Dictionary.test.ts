import { expect, test as fact } from "vitest";
import { Dictionary } from "./dictionary";
import { FigmaVariable, FigmaVariableCollection } from "./figmaApi";

fact("it creates a dictionary out of Figma Variables", () => {
  // GIVEN
  const variables: FigmaVariable[] = [
    {
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
  ];

  const collections: FigmaVariableCollection[] = [
    {
      id: "VariableCollectionId:11953:115879",
      name: ".Design Tokens",
      key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
      modes: [{ modeId: "11953:0", name: "Default" }],
      defaultModeId: "11953:0",
      remote: false,
      hiddenFromPublishing: true,
      variableIds: ["VariableID:11953:115880"],
    },
  ];

  const subject = Dictionary;

  // WHEN
  const result = subject.fromFigmaVariables({ variables, collections }).value;

  // THEN
  expect(result).toStrictEqual({
    blue: {
      $type: "color",
      $value: "#0000ff",
    },
  });
});

fact(
  "it creates a dictionary with nested values out of Figma Variables",
  () => {
    // GIVEN
    const variables: FigmaVariable[] = [
      {
        id: "VariableID:11953:115880",
        name: "Neutrals / Gray / 50",
        key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
        variableCollectionId: "VariableCollectionId:11953:115879",
        resolvedType: "COLOR",
        valuesByMode: {
          "11953:0": {
            r: 0.9764705896377563,
            g: 0.9803921580314636,
            b: 0.9843137264251709,
            a: 1,
          },
        },
        remote: false,
        description: "",
        hiddenFromPublishing: false,
        scopes: ["ALL_SCOPES"],
      },
    ];

    const collections: FigmaVariableCollection[] = [
      {
        id: "VariableCollectionId:11953:115879",
        name: ".Design Tokens",
        key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
        modes: [{ modeId: "11953:0", name: "Default" }],
        defaultModeId: "11953:0",
        remote: false,
        hiddenFromPublishing: true,
        variableIds: ["VariableID:11953:115880"],
      },
    ];

    const subject = Dictionary;

    // WHEN
    const result = subject.fromFigmaVariables({ variables, collections }).value;

    // THEN
    expect(result).toStrictEqual({
      neutrals: {
        gray: {
          50: {
            $type: "color",
            $value: "#f9fafb",
          },
        },
      },
    });
  }
);
