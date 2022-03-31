import type {AxiosPromise, AxiosRequestHeaders, AxiosResponse } from 'axios';
import Axios from 'axios';

export type node = {
    id: string,
    name: string,
    type: 'DOCUMENT' | 'CANVAS' | 'PAGE',
    children?: node[],
}

type FigmaFileResponse = {
    document: node,
}

type FigmaImageResponse = {
    err: null | unknown,
    images: {
        [nodeId: string]: string,
    },
}

export default class FigmaApiClient {
  httpClient = Axios.create({
    baseURL: 'https://api.figma.com/v1',
  });

  public getFile(key ?: string): Promise<AxiosResponse<FigmaFileResponse>> {
    if (!key) {
      key = process.env.FIGMA_FILE;
    }

    return this.httpClient.get<FigmaFileResponse>(
      `/files/${key}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  public getImages(ids: string[]): Promise<AxiosResponse<FigmaImageResponse>> {
    return this.httpClient.get<FigmaImageResponse>(
      `/images/${process.env.FIGMA_FILE}?format=svg&ids=${ids.join(',')}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  public downloadImage(url: string): AxiosPromise
  {
    return Axios({
      url,
      method: 'GET',
      responseType: 'blob',
    });
  }

  private getHeaders(): AxiosRequestHeaders {
    return {
      'X-Figma-Token': process.env.FIGMA_TOKEN,
    };
  }
}
