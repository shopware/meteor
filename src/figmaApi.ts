import { get } from "./httpClient";

type Config = {
  apiKey: string;
};

export class FigmaApi {
  constructor(private readonly config: Config) {}

  getLocalVariablesOfFile(fileKey: string) {
    return get(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
      Accept: "*/*",
      "X-Figma-Token": this.config.apiKey,
    });
  }
}
