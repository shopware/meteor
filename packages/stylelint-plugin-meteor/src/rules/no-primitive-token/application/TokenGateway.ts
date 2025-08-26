export interface TokenGateway {
  getTokens(): Promise<string[]>;
}
