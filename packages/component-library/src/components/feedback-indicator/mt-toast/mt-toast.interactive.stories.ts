import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta from "./mt-toast.stories";
import type { MtToastMeta, MtToastStory } from "./mt-toast.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback indicator/mt-toast",
} as MtToastMeta;

export const TestQuickTimer: MtToastStory = {
  name: "Test quick toast auto close",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Zoom 100%");

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    // Timeout is required because animations cause the element to stay in the dom for longer
    await waitUntil(() => !document.querySelector(".mt-toast-notification"), 4400);
    expect(toast).not.toBeInTheDocument();
  },
};

export const TestTimer: MtToastStory = {
  name: "Test toast auto close",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product couldn't be saved");

    const informalButton = await canvas.findByText("Add critical toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("alert");
    expect(toast).toBeInTheDocument();

    // Timeout is required because animations cause the element to stay in the dom for longer
    await waitUntil(() => !document.querySelector(".mt-toast-notification"), 11500);
    expect(toast).not.toBeInTheDocument();
  },
};

export const TestAction: MtToastStory = {
  name: "Test action",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const actionCheckbox = await canvas.getByText("Add action?");
    await userEvent.click(actionCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    const actionButton = await canvas.getByText("action");
    expect(actionButton).toBeInTheDocument();

    // Save original console.log
    const orgLog = window.console.log;

    // Look for action call
    let actionLogged = false;
    window.console.log = (msg) => {
      actionLogged = msg === "action";
    };

    await userEvent.click(actionButton);
    expect(actionLogged).toBe(true);

    // restore console.log
    window.console.log = orgLog;

    // Wait for the toast to be gone
    await waitUntil(() => !document.querySelector(".mt-toast-notification"));
    expect(toast).not.toBeInTheDocument();
  },
};

export const TestManualClose: MtToastStory = {
  name: "Test manual close",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const actionCheckbox = await canvas.getByText("Add action?");
    await userEvent.click(actionCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();

    await userEvent.click(toastCloseButton);

    // Wait for the toast to be gone
    await waitUntil(() => !document.querySelector(".mt-toast-notification"));
    expect(toast).not.toBeInTheDocument();
  },
};

export const TestEscClose: MtToastStory = {
  name: "Test keyboard close",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const actionCheckbox = await canvas.getByText("Add action?");
    await userEvent.click(actionCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    await userEvent.click(toast);
    await userEvent.keyboard("[Escape]");
    // Wait for the toast to be gone
    await waitUntil(() => !document.querySelector(".mt-toast-notification"));
    expect(toast).not.toBeInTheDocument();
  },
};

// Visual
export const VisualTestInformalQuick: MtToastStory = {
  name: "Render quick informal toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Zoom 100%");

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestPositivelQuick: MtToastStory = {
  name: "Render quick positive toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product saved");

    const informalButton = await canvas.findByText("Add positive toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestCritical: MtToastStory = {
  name: "Render critical toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Couldn't save product");

    const informalButton = await canvas.findByText("Add critical toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("alert");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestInformalDismissible: MtToastStory = {
  name: "Render dismissible informal toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Variant generation finished");

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();
  },
};

export const VisualTestPositiveDismissible: MtToastStory = {
  name: "Render dismissible positive toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product export successfull");

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    const informalButton = await canvas.findByText("Add positive toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();
  },
};

export const VisualTestCriticalDismissible: MtToastStory = {
  name: "Render dismissible critical toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product export failed");

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    const informalButton = await canvas.findByText("Add critical toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("alert");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();
  },
};

export const VisualTestInformalAction: MtToastStory = {
  name: "Render informal toast with action",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Variant generation finished");

    const dismissibleCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(dismissibleCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();
  },
};

export const VisualTestPositiveAction: MtToastStory = {
  name: "Render positive toast with action",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product export successfull");

    const dismissibleCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(dismissibleCheckbox);

    const informalButton = await canvas.findByText("Add positive toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();
  },
};

export const VisualTestCriticalAction: MtToastStory = {
  name: "Render critical toast with action",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product export failed");

    const dismissibleCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(dismissibleCheckbox);

    const informalButton = await canvas.findByText("Add critical toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("alertdialog");
    expect(toast).toBeInTheDocument();

    const toastCloseButton = await canvas.getByTestId("dismiss-toast");
    expect(toastCloseButton).toBeInTheDocument();
  },
};

export const VisualTestInformalIcon: MtToastStory = {
  name: "Render informal toast with icon",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Selected Z plane");

    const iconCheckbox = await canvas.findByText("Display toast icon?");
    await userEvent.click(iconCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestPositivelIcon: MtToastStory = {
  name: "Render positive toast with icon",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Product saved");

    const iconCheckbox = await canvas.findByText("Display toast icon?");
    await userEvent.click(iconCheckbox);

    const informalButton = await canvas.findByText("Add positive toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestCriticalIcon: MtToastStory = {
  name: "Render critical toast with icon",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Sorry for that");

    const iconCheckbox = await canvas.findByText("Display toast icon?");
    await userEvent.click(iconCheckbox);

    const informalButton = await canvas.findByText("Add critical toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("alert");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestInformalMaxed: MtToastStory = {
  name: "Render max informal toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Report ready");

    const iconCheckbox = await canvas.findByText("Display toast icon?");
    await userEvent.click(iconCheckbox);

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    const actionCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(actionCheckbox);

    const informalButton = await canvas.findByText("Add informal toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestPositivelMaxed: MtToastStory = {
  name: "Render maxed positive toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Export finished");

    const iconCheckbox = await canvas.findByText("Display toast icon?");
    await userEvent.click(iconCheckbox);

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    const actionCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(actionCheckbox);

    const informalButton = await canvas.findByText("Add positive toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("log");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestCriticalMaxed: MtToastStory = {
  name: "Render maxed critical toast",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, "Failed successfully");

    const iconCheckbox = await canvas.findByText("Display toast icon?");
    await userEvent.click(iconCheckbox);

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    const actionCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(actionCheckbox);

    const informalButton = await canvas.findByText("Add critical toast");
    await userEvent.click(informalButton);

    const toast = await canvas.getByRole("alertdialog");
    expect(toast).toBeInTheDocument();
  },
};

export const VisualTestCollapsedStack: MtToastStory = {
  name: "Render collapsed stack",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    let toastButton = await canvas.findByText("Add informal toast");
    await userEvent.click(toastButton);

    toastButton = await canvas.findByText("Add positive toast");
    await userEvent.click(toastButton);

    toastButton = await canvas.findByText("Add critical toast");
    await userEvent.click(toastButton);

    const toast = await canvas.getAllByText("Max three words");
    expect(toast.length).toEqual(3);
  },
};

export const VisualTestExpandedStack: MtToastStory = {
  name: "Render expanded stack",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const dismissibleCheckbox = await canvas.findByText("Toast manually dismissible?");
    await userEvent.click(dismissibleCheckbox);

    let toastButton = await canvas.findByText("Add informal toast");
    await userEvent.click(toastButton);

    toastButton = await canvas.findByText("Add positive toast");
    await userEvent.click(toastButton);

    await userEvent.click(dismissibleCheckbox);

    const actionCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(actionCheckbox);

    toastButton = await canvas.findByText("Add critical toast");
    await userEvent.click(toastButton);

    await userEvent.hover(await canvas.getByRole("alertdialog"));

    const toast = await canvas.getAllByText("Max three words");
    expect(toast.length).toEqual(3);
  },
};

export const VisualTestMessageTooLong: MtToastStory = {
  name: "Render toast with a too long message",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const message = "This message is too long to be displayed";
    const msg = await canvas.getByRole("textbox");
    await userEvent.clear(msg);
    await userEvent.type(msg, message);

    const actionCheckbox = await canvas.findByText("Add action?");
    await userEvent.click(actionCheckbox);

    const toastButton = await canvas.findByText("Add critical toast");
    await userEvent.click(toastButton);

    await userEvent.hover(await canvas.getByRole("alertdialog"));

    const toast = await canvas.getByText(message);
    expect(toast).toBeInTheDocument();
  },
};
