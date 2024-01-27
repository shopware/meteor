import { HttpClient } from '../../domain/http-client/HttpClient';

export class HttpClientUsingFetch implements HttpClient {
  get(url: string, headers?: Record<string, string>) {
    return fetch(url, {
      method: 'GET',
      headers,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    });
  }
}
