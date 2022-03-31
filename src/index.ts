import FigmaApiClient from './figma';
import FigmaUtil from './figma/util';
import * as fse from 'fs-extra';
import chalk from 'chalk';
import * as cliProgress from 'cli-progress';

const client = new FigmaApiClient();
const util = new FigmaUtil();

console.log(chalk.green('Fetching Figma file stand by...'));

client.getFile().then(async (response) => {
  const iconOverview = response.data.document.children.find(node => node.id === '217:6');
  console.log(chalk.green('Gathering icons...'));
  const iconMap = await util.buildIconMap(iconOverview);

  console.log(chalk.green('Downloading icons...'));
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  bar1.start(iconMap.size, 0);

  let count = 0;
  const promises: Promise<void>[] = [];
  iconMap.forEach((iconUrl, iconName) => {
    const promise = client.downloadImage(iconUrl).then((result) => {
      const svg = result.data as string;

      fse.outputFileSync(`${__dirname}/../${iconName}.svg`, svg);

      ++count;

      bar1.update(count);

      return Promise.resolve();
    });

    promises.push(promise);
  });

  return Promise.all(promises).then(() => {
    bar1.stop();
    console.log(chalk.green('All done!'));
  });
}).catch((e) => {
  console.error(e);
});
