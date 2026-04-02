import type { TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import path from "node:path";

const customSnapshotsDir = path.resolve(path.join(__dirname, "..", "/__snapshots__"));
const customReceivedDir = path.resolve(path.join(__dirname, "..", "/__snapshots__/__received__"));

export default {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preRender(page, context) {
    await page.setViewportSize({ width: 850, height: 650 });

    // use bigger viewport for data-table and toasts
    if (
      context.id.startsWith("components-mt-data-table-interaction-tests") ||
      context.id.startsWith("components-mt-entity-data-table-interaction-tests") ||
      context.id.startsWith("components-mt-toast-interaction-tests")
    ) {
      await page.setViewportSize({ width: 1600, height: 900 });
    }

    // use smaller viewport to test wrapping of multi select
    if (
      context.id ===
      "components-mt-select-interaction-tests--visual-test-ensure-correct-multi-selection-wrapping"
    ) {
      await page.setViewportSize({ width: 500, height: 650 });
    }
  },
  async postRender(page, context) {
    // Render screenshots only for interaction tests with Visual Test name
    if (!context.id.includes("-interaction-tests--") || !context.name.startsWith("Visual Test")) {
      return;
    }

    // wait 300ms before screenshot to make sure any pending animation is finished
    await (() => new Promise((resolve) => setTimeout(resolve, 300)))();

    const image = await page.screenshot({
      animations: "disabled",
    });

    expect(image).toMatchImageSnapshot({
      comparisonMethod: "ssim",
      customDiffConfig: { ssim: "fast" },
      failureThreshold: 10,
      failureThresholdType: "pixel",
      customSnapshotsDir,
      blur: 0,
      customSnapshotIdentifier: context.id + "-snap",
      storeReceivedOnFailure: true,
      customReceivedDir: customReceivedDir,
    });
  },
} satisfies TestRunnerConfig;
