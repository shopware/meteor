import FigmaApiClient from "./figma/index.js";
import FigmaUtil from "./figma/util/index.js";
import type { OptimizedSvg } from "svgo";
import { optimize } from "svgo";
import { PromisePool } from "@supercharge/promise-pool";
// @ts-expect-error - this dependency has no type definitions
import * as svgoAutocrop from "svgo-autocrop";
import path from "node:path";
import { WinstonLogger } from "./logger/winston-logger.js";
import ora from "ora";
import { CSSFile } from "./domain/css-file.js";
import { SCSSFile } from "./domain/scss-file.js";
import { NodeFilesystem } from "./filesystem/node-filesystem.js";
import { md5 } from "./utils.js";

const logger = new WinstonLogger();

const client = new FigmaApiClient();
const util = new FigmaUtil();

const spinner = ora("Syncing icons...").start();
logger.info("Starting to sync icons");

spinner.text = "Clearing icons/ directory";

const fileSystem = new NodeFilesystem(logger);

const iconDirectory = path.resolve(import.meta.dirname, "../icons");

fileSystem.removeDirectory(iconDirectory);

fileSystem.createDirectory(iconDirectory);
fileSystem.createDirectory(path.join(iconDirectory, "regular"));
fileSystem.createDirectory(path.join(iconDirectory, "solid"));

spinner.text = "Fetching icon data";

client
  .getFile()
  .then(async (response) => {
    spinner.succeed("Fetched icon data");

    // @ts-expect-error -- TODO: add types for figma response
    const iconOverview = response.data.document.children.find(
      (node) => node.id === "217:6"
    );

    spinner.start("Gathering icons");
    // @ts-expect-error -- TODO: add types for iconMap
    const iconMap = await util.buildIconMap(iconOverview);
    const meta = util.buildMeta(iconMap);

    spinner.succeed("Gathered icons");
    spinner.start("Optimizing icons");

    spinner.text = `Optimized ${0} out of ${iconMap.size} icons`;

    const styling = [] as { name: string; width: string; height: string }[];

    await PromisePool.for(Array.from(iconMap.keys()))
      .withConcurrency(25)
      .onTaskFinished((iconName, pool) => {
        spinner.text = `Optimized ${pool.processedCount()} out of ${iconMap.size} icons`;
      })
      .handleError((error) => {
        console.log(error);
      })
      .process(async (iconName: string) => {
        const icon = iconMap.get(iconName);
        if (!icon) {
          throw new Error(
            `Failed to optimize icon: ${iconName}; Icon does not exist`
          );
        }

        const result = await client.downloadImage(icon.image);
        const svg = result.data as string;
        logger.info("Received icon data", {
          icon: icon.image,
          svg,
        });

        // Remove width/height from SVGs
        logger.info(`Optimizing icon: ${icon.image}`);
        const optimizedSvgResult = optimize(svg, {
          plugins: [
            { name: "removeDimensions" },
            {
              ...svgoAutocrop,
              params: {
                disableTranslateWarning: true,
              },
            },
          ],
        }) as OptimizedSvg;

        let optimizedSvg = optimizedSvgResult.data;
        logger.info("Received optimized icon", {
          icon: icon.image,
          svg: optimizedSvg,
        });

        const viewBox = optimizedSvg.match(/viewBox="(\d*) (\d*) (\d*) (\d*)"/);
        if (viewBox) {
          const width = viewBox[3];
          const height = viewBox[4];
          if (!width || !height) {
            throw new Error(
              `Failed to optimize icon: ${iconName}; Could not extract width and height from viewBox`
            );
          }
          const className = iconName.replace(/icons\//, "").replace(/\//g, "-");

          // Add class name to SVG
          optimizedSvg = optimizedSvg.replace(
            /<svg/,
            `<svg id="meteor-icon-kit__${className}"`
          );

          styling.push({
            name: className,
            width,
            height,
          });

          logger.info(`Added className "${className}" to style map`);
        } else {
          console.error(`Could not find viewBox for ${iconName}`);
          logger.info(`Failed to further optimize icon: "${iconName}"`, {
            icon: icon.image,
          });
        }

        const pathToIcon = path.resolve(
          iconDirectory,
          `${iconName.replace("icons/", "")}.svg`
        );

        fileSystem.createFile(pathToIcon, optimizedSvg);
        logger.info(`Created icon: "${iconName}"`, {
          path: pathToIcon,
          svg: optimizedSvg,
        });
      });

    spinner.text = "Finished writing icons to filesystem";
    spinner.text = "Creating stylesheet";

    const css = new CSSFile();
    const scss = new SCSSFile();

    styling.forEach(({ name, width, height }) => {
      css.addIcon(name, {
        width,
        height,
      });

      scss.addIcon(name, {
        width: `${width}px`,
        height: `${height}px`,
      });
    });

    fileSystem.createFile(
      path.resolve(iconDirectory, `meteor-icon-kit-${md5(styling)}.css`),
      css.toString()
    );

    fileSystem.createFile(
      path.join(iconDirectory, "meteor-icon-kit.scss"),
      scss.toString()
    );

    spinner.text = "Creating meta data";
    fileSystem.createFile(
      path.resolve(iconDirectory, "meta.json"),
      JSON.stringify(meta)
    );

    logger.info("Finished syncing icons");

    spinner.succeed(`Finished syncing ${iconMap.size} icons!`);
  })
  .catch((e) => {
    throw e;
  });
