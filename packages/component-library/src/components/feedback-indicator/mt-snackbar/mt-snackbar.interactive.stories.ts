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

    // Add different snackbars
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
      message: "Upload snackbar message",
      type: "upload",
    });

    // Wait until all four snackbars are rendered
    await waitUntil(() => document.querySelectorAll('[role="alert"], [role="log"]').length >= 4);

    // Check snackbars contain the correct text
    const defaultSnackbar = document.querySelector('.mt-snackbar-notification');
    const alertSnackbar = document.querySelector('.mt-snackbar-notification--success');
    const errorSnackbar = document.querySelector('.mt-snackbar-notification--error');
    const uploadSnackbar = document.querySelector('.mt-snackbar-notification--upload');

    expect(defaultSnackbar?.textContent).toBe("Default snackbar message");
    expect(alertSnackbar?.textContent).toBe("Success snackbar message");
    expect(errorSnackbar?.textContent).toBe("Error snackbar message");
    expect(uploadSnackbar?.textContent).toContain("Upload snackbar message");
  },
};

export const TestTimer: MtSnackbarStory = {
  name: "Snackbars should close after timeout",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Spawn a snackbar
    addSnackbar({
      message: "Timer test snackbar",
      duration: 1000,
    });

    // Check if it is rendered (snackbars are teleported to body)
    await waitUntil(() => document.querySelector('.mt-snackbar-notification'));
    expect(document.querySelector('.mt-snackbar-notification')?.textContent).toBe("Timer test snackbar");

    // Wait for the timeout
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Expect the snackbar to be removed
    expect(document.querySelector('.mt-snackbar-notification')).toBe(null);
  },
};

export const TestAction: MtSnackbarStory = {
  name: "Snackbars should have action link",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Spawn a snackbar with an action link
    addSnackbar({
      message: "Action test snackbar",
      link: {
        text: "Click me",
        url: "/",
      },
    });

    // Check if snackbar is rendered
    await waitUntil(() => document.querySelector('.mt-snackbar-notification'));
    expect(document.querySelector('.mt-snackbar-notification')?.textContent).toContain("Action test snackbar");

    // Expect the action link to be rendered
    const actionLink = document.querySelector('a[href="/"]');
    expect(actionLink).toBeDefined();
  },
};

export const TestUploadProgress: MtSnackbarStory = {
  name: "Upload snackbars should show progress",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Spawn an upload snackbar
    const uploadSnackbar = addSnackbar({
      message: "Upload test snackbar",
      type: "upload",
      progressPercentage: 0,
      successMessage: "File uploaded successfully",
      errorMessage: "Upload failed. Please try again",
    });

    // Check if snackbar is rendered
    await waitUntil(() => document.querySelector('.mt-snackbar-notification--upload'));

    // Check snackbar contains the correct text
    const uploadSnackbarEl = document.querySelector('.mt-snackbar-notification--upload');
    expect(uploadSnackbarEl?.textContent).toContain("Upload test snackbar");
    expect(uploadSnackbarEl?.textContent).toContain("(0%)");

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        uploadSnackbar.progressPercentage = 100;
        uploadSnackbar.uploadState = "success";
      }
      uploadSnackbar.progressPercentage = currentProgress;
    }, 100);

    // wait for the progress to be 20%, 40%, 60%, 80% and 100%
    await waitUntil(() => uploadSnackbarEl?.textContent?.includes("(20%)"));
    expect(uploadSnackbarEl?.textContent).toContain("(20%)");
    await waitUntil(() => uploadSnackbarEl?.textContent?.includes("(40%)"));
    expect(uploadSnackbarEl?.textContent).toContain("(40%)");
    await waitUntil(() => uploadSnackbarEl?.textContent?.includes("(60%)"));
    expect(uploadSnackbarEl?.textContent).toContain("(60%)");
    await waitUntil(() => uploadSnackbarEl?.textContent?.includes("(80%)"));
    expect(uploadSnackbarEl?.textContent).toContain("(80%)");

    // Wait for the progress to be 100
    await waitUntil(() => uploadSnackbar.progressPercentage === 100);
    expect(uploadSnackbarEl?.textContent).toContain("File uploaded successfully");
  },
};

export const TestHoverPause: MtSnackbarStory = {
  name: "Hover should pause timer",
  play: async () => {
    const { addSnackbar } = useSnackbar();

    // Spawn a snackbar
    addSnackbar({
      message: "Hover pause test snackbar",
      duration: 200,
    });

    // Check snackbar is rendered
    await waitUntil(() => document.querySelector(".mt-snackbar-notification"));
    const snackbarEl = document.querySelector(".mt-snackbar-notification");
    expect(snackbarEl?.textContent).toContain("Hover pause test snackbar");

    // Hover over the snackbar
    await userEvent.hover(snackbarEl!);

    // Wait to check snackbar is still visible
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check if the snackbar is still visible (timer should be paused)
    expect(snackbarEl?.textContent).toContain("Hover pause test snackbar");

    // Un-hover the snackbar
    await userEvent.unhover(snackbarEl!);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check the snackbar no longer exists
    expect(snackbarEl).not.toBeInTheDocument();
  },
};
