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

    console.log("context.id", context.id);

    // use bigger viewport for data-table and toasts
    if (
      context.id.startsWith("interaction-tests-table-and-list") ||
      context.id.startsWith("interaction-tests-entity-mt-entity-data-table") ||
      context.id.startsWith("interaction-tests-feedback-indicator-mt-toast")
    ) {
      await page.setViewportSize({ width: 1600, height: 900 });
    }

    // use smaller viewport to test wrapping of multi select
    if (
      context.id ===
      "interaction-tests-form-mt-select--visual-test-ensure-correct-multi-selection-wrapping"
    ) {
      await page.setViewportSize({ width: 500, height: 650 });
    }
  },
  async postRender(page, context) {
    // Render screenshots only for interaction tests with Visual Test name
    if (!context.id.startsWith("interaction-tests") || !context.name.startsWith("Visual Test")) {
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
