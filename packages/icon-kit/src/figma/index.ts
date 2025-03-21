import type { AxiosPromise, AxiosRequestHeaders, AxiosResponse } from "axios";
import Axios from "axios";
import { env } from "../env.js";

export type node = {
  id: string;
  name: string;
  type: "DOCUMENT" | "CANVAS" | "PAGE";
  children?: node[];
  description: string;
};

type FigmaFileResponse = {
  document: node;
};

type FigmaImageResponse = {
  err: unknown;
  images: {
    [nodeId: string]: string;
  };
};

type FigmaNodeResponse = {
  components: node[];
};

export enum IconMode {
  REGULAR = "regular",
  SOLID = "solid",
}

export enum IconSize {
  DEFAULT = "",
  S = "s",
  XS = "xs",
  XXS = "xxs",
}

export type Icon = {
  image: string;
  nodeId: string;
  description?: string;
  tags?: string[];
};

export type Meta = {
  name: string;
  basename: string;
  mode: IconMode;
  size: IconSize;
  tags: string[];
  sizes: string[];
  modes: string[];
  related: string[];
};

export default class FigmaApiClient {
  // @ts-expect-error -- TODO: add types for axios
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  httpClient = Axios.create({
    baseURL: "https://api.figma.com/v1",
  });

  public getFile(key?: string): Promise<AxiosResponse<FigmaFileResponse>> {
    if (!key) {
      key = env.FIGMA_FILE;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.httpClient.get<FigmaFileResponse>(`/files/${key}`, {
      headers: this.getHeaders(),
    });
  }

  public getImages(ids: string[]): Promise<AxiosResponse<FigmaImageResponse>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.httpClient.get<FigmaImageResponse>(
      `/images/${env.FIGMA_FILE}?format=svg&ids=${ids.join(",")}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  public downloadImage(url: string): AxiosPromise {
    // @ts-expect-error -- TODO: add types for axios
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Axios({
      url,
      method: "GET",
      responseType: "blob",
    });
  }

  public getNodeInfo(ids: string[]): Promise<AxiosPromise<FigmaNodeResponse>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.httpClient.get(
      `/files/${env.FIGMA_FILE}?ids=${ids.join(",")}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  private getHeaders(): AxiosRequestHeaders {
    return {
      "X-Figma-Token": env.FIGMA_TOKEN,
    };
  }
}
