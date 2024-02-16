import { env } from '../env.js';
import { GenerateArtifacts } from '../GenerateArtifacts.js';
import { HardDiskFileSystem } from '../common/infrastructure/file-system/HardDiskFileSystem.js';
import { FigmaApi } from '../figma/infrastructure/FigmaApi.js';
import { HttpClientUsingFetch } from '../common/infrastructure/http-client/HttpClientUsingFetch.js';
import ora from 'ora';

const fileSystem = new HardDiskFileSystem();
const figmaApi = new FigmaApi(
  {
    apiKey: env.FIGMA_TOKEN,
  },
  new HttpClientUsingFetch(),
);

const spinner = ora('Generating artifacts').start();

try {
  await new GenerateArtifacts(fileSystem, figmaApi).execute();

  spinner.succeed('Artifacts generated');
} catch (error) {
  spinner.stop();

  console.error(error);
}
