import { Dictionary } from "../dictionary";
import { env } from "../env";
import { FigmaApi } from "../figmaApi";
import StyleDictionary from "style-dictionary";
import { HardDiskFileSystem } from "../common/infrastructure/file-system/HardDiskFileSystem";

const fileSystem = new HardDiskFileSystem();

const figmaApi = new FigmaApi({
  apiKey: env.API_KEY,
});

// https://www.figma.com/file/hSDX8IwmRAPOTL4NWPwVCl/%F0%9F%92%8E-Meteor-Primitives-%E2%80%93-0.0.1?type=design&node-id=1963%3A238380&mode=design&t=MIvPuq8LZIwxU80T-1
const keyOfFileContainingPrimitiveTokens = "hSDX8IwmRAPOTL4NWPwVCl";

// https://www.figma.com/file/8X90GCcpIa4GllKCHA7qFM/%F0%9F%92%8E-Meteor-Admin-Tokens-%E2%80%93-0.0.1?type=design&node-id=4%3A147&mode=design&t=YlIcPJh7KZX41p3T-1
const keyOfFileContainingAdminTokens = "8X90GCcpIa4GllKCHA7qFM";

figmaApi
  .getLocalVariablesOfFile(keyOfFileContainingPrimitiveTokens)
  .then((response) => {
    console.dir(response.meta, { depth: null });
  });

const [primitiveTokenResponse, adminTokenResponse] = await Promise.all(
  [keyOfFileContainingPrimitiveTokens, keyOfFileContainingAdminTokens].map(
    (fileKey) => figmaApi.getLocalVariablesOfFile(fileKey)
  )
);

const primitiveDictionary = Dictionary.fromFigmaApiResponse(
  primitiveTokenResponse
);
const adminDictionary = Dictionary.fromFigmaApiResponse(
  adminTokenResponse,
  primitiveTokenResponse
);

const { $type: _, ...primitiveTokens } =
  primitiveDictionary.value["light mode"];
const { $type: __, ...adminTokensForLightMode } =
  adminDictionary.value["light mode"];
const { $type: ___, ...adminTokensForDarkMode } =
  adminDictionary.value["dark mode"];

fileSystem.saveFile(
  "./tokens/foundation/primitives.tokens.json",
  JSON.stringify(primitiveTokens, null, 2)
);

fileSystem.saveFile(
  "./tokens/administration/light.tokens.json",
  // TODO: format with prettier
  JSON.stringify(adminTokensForLightMode, null, 2)
);

fileSystem.saveFile(
  "./tokens/administration/dark.tokens.json",
  // TODO: format with prettier
  JSON.stringify(adminTokensForDarkMode, null, 2)
);

StyleDictionary.registerParser({
  pattern: /\.json$|\.tokens\.json$|\.tokens$/,
  parse: ({ contents }: { contents: string }) => {
    // replace $value with value so that style dictionary recognizes it
    const preparedContent = (contents || "{}")
      .replace(/"\$?value"\s*:/g, '"value":')
      // convert $description to comment
      .replace(/"\$?description"\s*:/g, '"comment":');

    return JSON.parse(preparedContent);
  },
});

// TODO: clear dist before building

StyleDictionary.extend({
  source: ["./tokens/foundation/*.tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "./dist/foundation/",
      files: [
        {
          destination: "primitives.css",
          format: "css/variables",
        },
      ],
    },
  },
}).buildAllPlatforms();

StyleDictionary.extend({
  source: [
    "./tokens/foundation/*.tokens.json",
    "./tokens/administration/light.tokens.json",
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "./dist/administration/",
      files: [
        {
          destination: "light.css",
          format: "css/variables",
        },
      ],
    },
  },
}).buildAllPlatforms();

StyleDictionary.extend({
  source: [
    "./tokens/foundation/*.tokens.json",
    "./tokens/administration/dark.tokens.json",
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "./dist/administration/",
      files: [
        {
          destination: "dark.css",
          format: "css/variables",
        },
      ],
    },
  },
}).buildAllPlatforms();
