import { expect, test as fact } from "vitest";
import { Dictionary } from "./dictionary";
import {
  FigmaApi,
  FigmaApiResponse,
  FigmaVariable,
  FigmaVariableCollection,
} from "./figmaApi";

fact("it creates a dictionary out of Figma Variables", () => {
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

  const subject = Dictionary;

  // WHEN
  const result = subject.fromFigmaApiResponse(response).value;

  // THEN
  expect(result).toStrictEqual({
    default: {
      $type: "mode",
      blue: {
        $type: "color",
        $value: "#0000ff",
      },
    },
  });
});

fact(
  "it creates a dictionary with nested Tokens out of Figma Variables",
  () => {
    // GIVEN
    const response: FigmaApiResponse = {
      status: 200,
      error: false,
      meta: {
        variables: {
          "VariableID:11953:115880": {
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

    const subject = Dictionary;

    // WHEN
    const result = subject.fromFigmaApiResponse(response).value;

    // THEN
    expect(result).toStrictEqual({
      default: {
        $type: "mode",
        neutrals: {
          gray: {
            50: {
              $type: "color",
              $value: "#f9fafb",
            },
          },
        },
      },
    });
  }
);

fact(
  "it creates a dictionary containing an aliased Token out of Figma Variables",
  () => {
    // GIVEN
    const response: FigmaApiResponse = {
      status: 200,
      error: false,
      meta: {
        variables: {
          "VariableID:41413:11953": {
            id: "VariableID:41413:11953",
            name: "Neutrals / Gray / 50",
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
          "VariableID:11953:115880": {
            id: "VariableID:11953:115880",
            name: "Text / Secondary / Default",
            key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
            variableCollectionId: "VariableCollectionId:11953:115879",
            resolvedType: "COLOR",
            valuesByMode: {
              "11953:0": {
                type: "VARIABLE_ALIAS",
                id: "VariableID:41413:11953",
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

    const subject = Dictionary;

    // WHEN
    const result = subject.fromFigmaApiResponse(response).value;

    // THEN
    expect(result).toStrictEqual({
      default: {
        $type: "mode",
        neutrals: {
          gray: {
            50: {
              $type: "color",
              $value: "#0000ff",
            },
          },
        },
        text: {
          secondary: {
            default: {
              $type: "color",
              $value: "{neutrals.gray.50}",
            },
          },
        },
      },
    });
  }
);

fact(
  "it creates a dictionary out of Figma Variables with multiple modes",
  () => {
    // GIVEN
    const response: FigmaApiResponse = {
      status: 200,
      error: false,
      meta: {
        variables: {
          "VariableID:41413:11953": {
            id: "VariableID:41413:11953",
            name: "Color / Elevation / Surface / Overlay",
            key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
            variableCollectionId: "VariableCollectionId:11953:115879",
            resolvedType: "COLOR",
            valuesByMode: {
              "11953:0": {
                r: 1,
                g: 1,
                b: 1,
                a: 1,
              },
              "11953:1": {
                r: 0,
                g: 0,
                b: 0,
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
            modes: [
              { modeId: "11953:0", name: "Light" },
              { modeId: "11953:1", name: "Dark" },
            ],
            defaultModeId: "11953:0",
            remote: false,
            hiddenFromPublishing: true,
            variableIds: ["VariableID:11953:115880"],
          },
        },
      },
    };

    const subject = Dictionary;

    // WHEN
    const result = subject.fromFigmaApiResponse(response).value;

    // THEN
    expect(result).toStrictEqual({
      light: {
        $type: "mode",
        color: {
          elevation: {
            surface: {
              overlay: {
                $type: "color",
                $value: "#ffffff",
              },
            },
          },
        },
      },
      dark: {
        $type: "mode",
        color: {
          elevation: {
            surface: {
              overlay: {
                $type: "color",
                $value: "#000000",
              },
            },
          },
        },
      },
    });
  }
);

fact(
  "it creates a dictionary containing aliased Tokens that reference Design Tokens from other files",
  () => {
    // GIVEN
    const response: FigmaApiResponse = {
      status: 200,
      error: false,
      meta: {
        variables: {
          "VariableID:41413:11953": {
            id: "VariableID:41413:11953",
            name: "Color / Elevation / Surface / Overlay",
            key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
            variableCollectionId: "VariableCollectionId:11953:115879",
            resolvedType: "COLOR",
            valuesByMode: {
              "11953:0": {
                type: "VARIABLE_ALIAS",
                id: "VariableID:db9aa5d3b7c6f03b4cddb78e045b566fae112d17/51413:51953",
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
            variableIds: ["VariableID:41413:11953"],
          },
        },
      },
    };

    const responseOfFileWithPrimitiveTokens: FigmaApiResponse = {
      status: 200,
      error: false,
      meta: {
        variableCollections: {
          "VariableCollectionId:21953:215879": {
            id: "VariableCollectionId:21953:215879",
            name: ".Design Tokens",
            key: "9130479ef323598b1ccfb32e7b16dc80fcb30f14",
            modes: [{ modeId: "11953:0", name: "Default" }],
            defaultModeId: "11953:0",
            remote: false,
            hiddenFromPublishing: true,
            variableIds: ["VariableID:51413:51953"],
          },
        },
        variables: {
          "VariableID:51413:51953": {
            id: "VariableID:51413:51953",
            name: "Gray / 50",
            key: "db9aa5d3b7c6f03b4cddb78e045b566fae112d17",
            variableCollectionId: "VariableCollectionId:21953:215879",
            resolvedType: "COLOR",
            valuesByMode: {
              "11953:0": {
                r: 0,
                g: 0,
                b: 0,
                a: 1,
              },
            },
            remote: false,
            description: "",
            hiddenFromPublishing: false,
            scopes: ["ALL_SCOPES"],
          },
        },
      },
    };

    const subject = Dictionary;

    // WHEN
    const result = subject.fromFigmaApiResponse(
      response,
      responseOfFileWithPrimitiveTokens
    ).value;

    // THEN
    expect(result).toStrictEqual({
      default: {
        $type: "mode",
        color: {
          elevation: {
            surface: {
              overlay: {
                $type: "color",
                $value: "{gray.50}",
              },
            },
          },
        },
      },
    });
  }
);
