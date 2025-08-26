import { TokenGateway } from "../application/TokenGateway.js";

const extractTokens = (obj: any, path: string[] = []): string[] => {
  let tokens: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null && !("$value" in value)) {
      tokens = tokens.concat(extractTokens(value, [...path, key]));
    } else if (
      typeof value === "object" &&
      value !== null &&
      "$value" in value
    ) {
      tokens.push([...path, key].join("-"));
    }
  }

  return tokens;
};

export class TokenGatewayUsingImport implements TokenGateway {
  async getTokens(): Promise<string[]> {
    const dictionary = await import(
      "@shopware-ag/meteor-tokens/foundation/primitives.json",
      { with: { type: "json" } }
    );

    return extractTokens(dictionary.default);
  }
}
