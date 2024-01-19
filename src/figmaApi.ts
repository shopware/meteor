type Config = {
  apiKey: string;
};

export class FigmaApi {
  constructor(private readonly config: Config) {}

  getDesignTokens(fileKey: string) {
    return fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "X-Figma-Token": this.config.apiKey,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    });
  }
}
