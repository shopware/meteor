import FigmaApiClient from './figma';
import FigmaUtil from './figma/util';
import * as fse from 'fs-extra';
import chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import type { OptimizedSvg } from 'svgo';
import { optimize } from 'svgo';
// @ts-expect-error - this dependency has no type definitions
import * as svgoAutocrop from 'svgo-autocrop';

const client = new FigmaApiClient();
const util = new FigmaUtil();

console.log(chalk.green('Clean up...'));

fse.removeSync(`${__dirname}/../icons`);

console.log(chalk.green('Fetching Figma file stand by...'));

client.getFile().then(async (response) => {
  const iconOverview = response.data.document.children.find(node => node.id === '217:6');
  console.log(chalk.green('Gathering icons...'));
  const iconMap = await util.buildIconMap(iconOverview);

  console.log(chalk.green('Downloading and optimizing icons...'));
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  bar1.start(iconMap.size, 0);

  let count = 0;
  const promises: Promise<void>[] = [];

  iconMap.forEach((iconUrl, iconName) => {
    const promise = Promise.resolve().then(async () => {
      // Sleep for a random number below 10s to avoid too many connections at the same time
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 10000)));

      return client.downloadImage(iconUrl).then((result) => {
        const svg = result.data as string;

        // Remove width/height from SVGs
        const optimizedSvgResult = optimize(svg, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          plugins: [
            { name: 'removeDimensions' },
            {
              ...svgoAutocrop,
              params: {
                disableTranslateWarning: true,
              },
            },
          ],
        }) as OptimizedSvg;

        const optimizedSvg = optimizedSvgResult.data;

        fse.outputFileSync(`${__dirname}/../${iconName}.svg`, optimizedSvg);

        ++count;

        bar1.update(count);

        return Promise.resolve();
      });
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
