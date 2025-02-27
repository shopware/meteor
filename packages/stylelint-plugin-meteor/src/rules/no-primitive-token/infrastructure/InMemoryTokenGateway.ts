import { TokenGateway } from "../application/TokenGateway.js";

export class InMemoryTokenGateway implements TokenGateway {
  constructor(public tokens: string[]) {}

  async getTokens(): Promise<string[]> {
    return this.tokens;
  }
}
