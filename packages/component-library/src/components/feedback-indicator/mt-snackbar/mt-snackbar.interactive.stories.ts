import { userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta from "./mt-snackbar.stories";
import type { MtSnackbarMeta, MtSnackbarStory } from "./mt-snackbar.stories";
import { useSnackbar } from "./composables/use-snackbar";

export default {
  ...meta,
  title: "Interaction Tests/Feedback indicator/mt-snackbar",
} as MtSnackbarMeta;

export const VisualTestDefault: MtSnackbarStory = {
  name: "Render snackbars",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Add different types of snackbars
    addSnackbar({
      message: "Default snackbar message",
    });

    addSnackbar({
      message: "Success snackbar message",
      type: "success",
    });

    addSnackbar({
      message: "Error snackbar message",
      type: "error",
    });

    addSnackbar({
      message: "Warning snackbar message",
      type: "warning",
    });

    addSnackbar({
      message: "Upload snackbar message",
      type: "upload",
      progressPercentage: 50,
    });

    // Wait for snackbars to appear - they are teleported to body, so check document
    await waitUntil(() => document.querySelectorAll('[role="alert"], [role="log"]').length >= 5);

    // Check if all snackbars are rendered (error has alert role, others have log role)
    const alertSnackbars = document.querySelectorAll('[role="alert"]');
    const logSnackbars = document.querySelectorAll('[role="log"]');
    expect(alertSnackbars.length + logSnackbars.length).toBeGreaterThanOrEqual(5);

    // Check that each message is present in any of the snackbars
    const allSnackbarText = Array.from(logSnackbars)
      .concat(Array.from(alertSnackbars))
      .map((el) => el.textContent)
      .join(" ");

    expect(allSnackbarText).toContain("Default snackbar message");
    expect(allSnackbarText).toContain("Success snackbar message");
    expect(allSnackbarText).toContain("Error snackbar message");
    expect(allSnackbarText).toContain("Warning snackbar message");
    expect(allSnackbarText).toContain("Upload snackbar message");
  },
};

export const TestTimer: MtSnackbarStory = {
  name: "Snackbars should close after timeout",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Clear any existing snackbars first
    const existingSnackbars = document.querySelectorAll('[role="log"], [role="alert"]');
    existingSnackbars.forEach((snackbar) => snackbar.remove());

    // Spawn a snackbar with short duration for testing
    addSnackbar({
      message: "Timer test snackbar",
      duration: 1000, // 1 second for faster testing
    });

    // Check if it is rendered (snackbars are teleported to body)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) => el.textContent?.includes("Timer test snackbar"));
    });

    const timerSnackbar = Array.from(document.querySelectorAll('[role="log"]')).find((el) =>
      el.textContent?.includes("Timer test snackbar"),
    );
    expect(timerSnackbar?.textContent).toContain("Timer test snackbar");

    // Wait for the timeout (1 second + buffer)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if it is closed
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return !Array.from(snackbars).some((el) => el.textContent?.includes("Timer test snackbar"));
    });

    const remainingSnackbars = Array.from(document.querySelectorAll('[role="log"]')).some((el) =>
      el.textContent?.includes("Timer test snackbar"),
    );
    expect(remainingSnackbars).toBe(false);
  },
};

export const TestAction: MtSnackbarStory = {
  name: "Snackbars should have action link",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Clear any existing snackbars first
    const existingSnackbars = document.querySelectorAll('[role="log"], [role="alert"]');
    existingSnackbars.forEach((snackbar) => snackbar.remove());

    // Spawn a snackbar with an action link
    addSnackbar({
      message: "Action test snackbar",
      link: {
        text: "Click me",
        url: "/test-action",
      },
    });

    // Check if it is rendered (snackbars are teleported to body)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) => el.textContent?.includes("Action test snackbar"));
    });

    const actionSnackbar = Array.from(document.querySelectorAll('[role="log"]')).find((el) =>
      el.textContent?.includes("Action test snackbar"),
    );
    expect(actionSnackbar?.textContent).toContain("Action test snackbar");

    // Check if the action link is rendered
    const actionLink = document.querySelector('a[href="/test-action"]');
    expect(actionLink).toBeInTheDocument();
    expect(actionLink?.textContent).toContain("Click me");
  },
};

export const TestSuccessTimer: MtSnackbarStory = {
  name: "Success snackbars should close after timeout",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Clear any existing snackbars first
    const existingSnackbars = document.querySelectorAll('[role="log"], [role="alert"]');
    existingSnackbars.forEach((snackbar) => snackbar.remove());

    // Spawn a success snackbar with short duration for testing
    addSnackbar({
      message: "Success timer test snackbar",
      type: "success",
      duration: 1000, // 1 second for faster testing
    });

    // Check if it is rendered (snackbars are teleported to body)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) =>
        el.textContent?.includes("Success timer test snackbar"),
      );
    });

    const successSnackbar = Array.from(document.querySelectorAll('[role="log"]')).find((el) =>
      el.textContent?.includes("Success timer test snackbar"),
    );
    expect(successSnackbar?.textContent).toContain("Success timer test snackbar");

    // Wait for the timeout (1 second + buffer)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if it is closed
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return !Array.from(snackbars).some((el) =>
        el.textContent?.includes("Success timer test snackbar"),
      );
    });

    const remainingSnackbars = Array.from(document.querySelectorAll('[role="log"]')).some((el) =>
      el.textContent?.includes("Success timer test snackbar"),
    );
    expect(remainingSnackbars).toBe(false);
  },
};

export const TestUploadProgress: MtSnackbarStory = {
  name: "Upload snackbars should show progress",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Clear any existing snackbars first
    const existingSnackbars = document.querySelectorAll('[role="log"], [role="alert"]');
    existingSnackbars.forEach((snackbar) => snackbar.remove());

    // Spawn an upload snackbar
    const uploadSnackbar = addSnackbar({
      message: "Upload test snackbar",
      type: "upload",
      progressPercentage: 0,
      successMessage: "File uploaded successfully",
      errorMessage: "Upload failed. Please try again",
    });

    // Check if it is rendered (snackbars are teleported to body)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) => el.textContent?.includes("Upload test snackbar"));
    });

    const uploadSnackbarEl = Array.from(document.querySelectorAll('[role="log"]')).find((el) =>
      el.textContent?.includes("Upload test snackbar"),
    );
    expect(uploadSnackbarEl?.textContent).toContain("Upload test snackbar");

    // Check if the progress percentage is shown (it's just text, not a progress bar)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) => el.textContent?.includes("(0%)"));
    });
    expect(uploadSnackbarEl?.textContent).toContain("(0%)");

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        uploadSnackbar.uploadState = "success";
        uploadSnackbar.progressPercentage = 100;
      }
      uploadSnackbar.progressPercentage = currentProgress;
    }, 100);

    // Wait for the progress to be 100
    await waitUntil(() => uploadSnackbar.progressPercentage === 100);

    // Check if success message is shown
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) =>
        el.textContent?.includes("File uploaded successfully"),
      );
    });
    expect(uploadSnackbarEl?.textContent).toContain("File uploaded successfully");

    // Wait a bit for the success message to auto-close
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the snackbar is closed
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return !Array.from(snackbars).some((el) => el.textContent?.includes("Upload test snackbar"));
    });

    const remainingSnackbars = Array.from(document.querySelectorAll('[role="log"]')).some((el) =>
      el.textContent?.includes("Upload test snackbar"),
    );
    expect(remainingSnackbars).toBe(false);
  },
};

export const TestHoverPause: MtSnackbarStory = {
  name: "Hover should pause timer",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Clear any existing snackbars first
    const existingSnackbars = document.querySelectorAll('[role="log"], [role="alert"]');
    existingSnackbars.forEach((snackbar) => snackbar.remove());

    // Spawn a snackbar with longer duration for hover testing
    addSnackbar({
      message: "Hover pause test snackbar",
      duration: 3000, // 3 seconds for hover testing
    });

    // Check if it is rendered (snackbars are teleported to body)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return Array.from(snackbars).some((el) =>
        el.textContent?.includes("Hover pause test snackbar"),
      );
    });

    const snackbar = Array.from(document.querySelectorAll('[role="log"]')).find((el) =>
      el.textContent?.includes("Hover pause test snackbar"),
    );
    expect(snackbar?.textContent).toContain("Hover pause test snackbar");

    // Hover over the snackbar
    await userEvent.hover(snackbar!);

    // Wait a bit to ensure hover state is active
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if the snackbar is still visible (timer should be paused)
    expect(snackbar?.textContent).toContain("Hover pause test snackbar");

    // Unhover the snackbar
    await userEvent.unhover(snackbar!);

    // Wait for the timer to complete (3 seconds + buffer)
    await new Promise((resolve) => setTimeout(resolve, 3500));

    // Check if the snackbar is closed (timer should have resumed)
    await waitUntil(() => {
      const snackbars = document.querySelectorAll('[role="log"]');
      return !Array.from(snackbars).some((el) =>
        el.textContent?.includes("Hover pause test snackbar"),
      );
    });

    const remainingSnackbars = Array.from(document.querySelectorAll('[role="log"]')).some((el) =>
      el.textContent?.includes("Hover pause test snackbar"),
    );
    expect(remainingSnackbars).toBe(false);
  },
};
