import { env } from "../env";
import { FigmaApi } from "../figmaApi";

const figmaApi = new FigmaApi({
  apiKey: env.API_KEY,
});

const fileKey = "Krub3xbG0vMUdoL8vzEZ7l";
figmaApi.getLocalVariablesOfFile(fileKey);
