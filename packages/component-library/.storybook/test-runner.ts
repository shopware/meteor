const { toMatchImageSnapshot } = require("jest-image-snapshot");

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;
const customReceivedDir = `${process.cwd()}/__snapshots__/__received__`;

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preRender(page, context) {
    await page.setViewportSize({ width: 850, height: 650 });

    // use bigger viewport for data-table
    if (context.id.startsWith("interaction-tests-table-and-list")) {
      await page.setViewportSize({ width: 1600, height: 900 });
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

    // @ts-expect-error
    expect(image).toMatchImageSnapshot({
      comparisonMethod: "ssim",
      customDiffConfig: { ssim: "fast" },
      failureThreshold: 0.01,
      failureThresholdType: "percent",
      customSnapshotsDir,
      blur: 0.001,
      customSnapshotIdentifier: context.id + "-snap",
      storeReceivedOnFailure: true,
      customReceivedDir: customReceivedDir,
    });
  },
};
