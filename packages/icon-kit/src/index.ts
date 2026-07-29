import FigmaApiClient from "./figma/index.js";
import FigmaUtil from "./figma/util/index.js";
import { optimize } from "svgo";
import type { CustomPlugin } from "svgo";
import { PromisePool } from "@supercharge/promise-pool";
// Vendored SVGO plugin (CommonJS, untyped); see ./autocrop/README.md
import svgoAutocrop from "./autocrop/index.cjs";
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
    // Phase 1 — download every icon's raw SVG. This is network-bound and finishes
    // in a few seconds. It must NOT be interleaved with the optimize step below:
    // the autocrop plugin rasterises each SVG synchronously via resvg (~0.5s/icon),
    // which blocks the event loop long enough that concurrent in-flight S3 sockets
    // stall and AWS resets them ("socket hang up" / ECONNRESET).
    spinner.start("Downloading icons");
    spinner.text = `Downloaded ${0} out of ${iconMap.size} icons`;

    const rawSvgs = new Map<string, string>();

    await PromisePool.for(Array.from(iconMap.keys()))
      .withConcurrency(25)
      .onTaskFinished((iconName, pool) => {
        spinner.text = `Downloaded ${pool.processedCount()} out of ${iconMap.size} icons`;
      })
      .handleError((error) => {
        console.log(error);
      })
      .process(async (iconName: string) => {
        const icon = iconMap.get(iconName);
        if (!icon) {
          throw new Error(
            `Failed to download icon: ${iconName}; Icon does not exist`
          );
        }

        const result = await client.downloadImage(icon.image);
        rawSvgs.set(iconName, result.data as string);
        logger.info("Received icon data", {
          icon: icon.image,
          svg: result.data,
        });
      });

    // Phase 2 — optimize + write. Pure CPU work with no open sockets, so blocking
    // the event loop here is harmless.
    spinner.start("Optimizing icons");
    spinner.text = `Optimized ${0} out of ${iconMap.size} icons`;

    const styling = [] as { name: string; width: string; height: string }[];

    let optimizedCount = 0;
    for (const [iconName, svg] of rawSvgs) {
      const icon = iconMap.get(iconName)!;

      // Remove width/height from SVGs
      logger.info(`Optimizing icon: ${icon.image}`);
      const optimizedSvgResult = optimize(svg, {
        plugins: [
          { name: "removeDimensions" },
          {
            ...(svgoAutocrop as unknown as CustomPlugin<{
              disableTranslateWarning: boolean;
            }>),
            params: {
              disableTranslateWarning: true,
            },
          },
        ],
        // svgo's `optimize()` always returns an object with a string `data`
        // field. Asserting just that keeps this resilient across svgo majors
        // (the old `OptimizedSvg` type was removed in svgo 3+).
      }) as { data: string };

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

      optimizedCount++;
      spinner.text = `Optimized ${optimizedCount} out of ${iconMap.size} icons`;
    }

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
