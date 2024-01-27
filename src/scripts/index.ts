import { env } from '../env';
import { GenerateArtifacts } from '../application/GenerateArtifacts';
import { HardDiskFileSystem } from '../common/infrastructure/file-system/HardDiskFileSystem';
import { FigmaApi } from '../figmaApi';
import { HttpClientUsingFetch } from '../common/infrastructure/http-client/HttpClientUsingFetch';
import ora from 'ora';

const fileSystem = new HardDiskFileSystem();
const figmaApi = new FigmaApi(
  {
    apiKey: env.API_KEY,
  },
  new HttpClientUsingFetch(),
);

const spinner = ora('Generating artifacts').start();

await new GenerateArtifacts(fileSystem, figmaApi).execute();

spinner.succeed('Artifacts generated');
