export interface HttpClient {
  get(url: string, headers?: Record<string, string>): Promise<any>;
}
