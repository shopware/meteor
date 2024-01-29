export interface HttpClient {
  get<TResponse = unknown>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<TResponse>;
}
