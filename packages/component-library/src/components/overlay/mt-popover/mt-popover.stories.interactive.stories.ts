import { waitUntil } from "../../../_internal/test-helper";
import { within, userEvent, fireEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtPopoverMeta, type MtPopoverStory } from "./mt-popover.stories";

export default {
  ...meta,
  title: "Interaction Tests/Overlay/mt-popover",
} as MtPopoverMeta;

export const VisualTestRenderPopoverTrigger: MtPopoverStory = {
  name: "Should render only the popover trigger",
};

export const VisualTestRenderPopover: MtPopoverStory = {
  name: "Should render the popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => document.body.textContent?.includes("Toggle popover"));

    const popoverToggle = canvas.getByText("Toggle popover");
    await userEvent.click(popoverToggle);

    const popover = within(document.querySelector(".mt-floating-ui__content") as HTMLElement);
    expect(popover.getByText("Popover example")).toBeInTheDocument();
  },
};

export const VisualTestRenderChildView: MtPopoverStory = {
  name: "Should render the popover with child view",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => document.body.textContent?.includes("Toggle popover"));

    const popoverToggle = canvas.getByText("Toggle popover");
    await userEvent.click(popoverToggle);

    const popover = within(document.querySelector(".mt-floating-ui__content") as HTMLElement);
    expect(popover.getByText("Popover example")).toBeInTheDocument();

    const columnsItem = popover.getByText("Columns");

    await userEvent.click(columnsItem);
  },
};

export const VisualTestRenderWithoutFloat: MtPopoverStory = {
  name: "Should render the popover with disabled float and without trigger",
  args: {
    disableFloat: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => document.body.textContent?.includes("Popover example"));

    expect(canvas.getByText("Popover example")).toBeInTheDocument();
  },
};

export const VisualTestDragAndDrop: MtPopoverStory = {
  name: "Should only allow one drop zone to be highlighted at a time",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the popover
    const popoverToggle = canvas.getByText("Toggle popover");
    await userEvent.click(popoverToggle);

    // Wait for the popover to be visible and find the Columns item
    await waitUntil(() => {
      const columnsItem = document.querySelector(".mt-popover-item");
      return columnsItem && columnsItem.textContent?.includes("Columns");
    });

    // Navigate to the column order view
    const columnButton = document.querySelector(".mt-popover-item");
    await expect(columnButton).toBeInTheDocument();
    await userEvent.click(columnButton as Element);

    // Wait for the view to change and the column order content to be visible
    await waitUntil(() => {
      const popoverItems = document.querySelector(".mt-popover__items");
      return popoverItems && popoverItems.textContent?.includes("Name");
    });

    // Find popover items
    const popoverItemResult = document.querySelector(".mt-popover-item-result");
    expect(popoverItemResult).toBeInTheDocument();

    // Wait for the draggable items to be rendered
    await waitUntil(() => {
      const draggableItems = popoverItemResult?.querySelectorAll(".mt-popover-item.is--draggable");
      return draggableItems && draggableItems.length > 0;
    });

    const draggableItems = popoverItemResult?.querySelectorAll(".mt-popover-item.is--draggable");
    expect(draggableItems).toBeDefined();
    expect(draggableItems?.length).toBeGreaterThan(0);

    // Use the first draggable item
    const draggableItem = draggableItems?.[1] as HTMLElement;
    await expect(draggableItem).toBeInTheDocument();

    // Start dragging the column
    fireEvent.mouseDown(draggableItem as Element, {
      buttons: 1,
    });

    // Wait for the drag delay (200ms)
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Check if dragging has started
    const elementHasDraggingClass = draggableItem.classList.contains("is--dragging");
    expect(elementHasDraggingClass).toBe(true);

    // Drag the item to a drop zone
    const dropZones = popoverItemResult?.querySelectorAll(
      ".mt-popover-item-result__option_drop_before, .mt-popover-item-result__option_drop_after",
    );

    // Use the first drop zone
    const targetDropZone = dropZones?.[0] as HTMLElement;

    // Simulate dragging over the drop zone
    fireEvent.mouseEnter(targetDropZone);

    // Wait before dropping
    await new Promise((resolve) => setTimeout(resolve, 100));

    const allDropZones = popoverItemResult?.querySelectorAll(
      ".mt-popover-item-result__option_drop_before, .mt-popover-item-result__option_drop_after",
    );
    const highlightedDropZones = Array.from(allDropZones as NodeListOf<Element>).filter((zone) =>
      zone.classList.contains("is--valid-drop"),
    );

    // Only one drop zone should be highlighted at a time
    expect(highlightedDropZones.length).toBe(1);
    expect(highlightedDropZones[0]).toBe(targetDropZone);

    // Drop the item
    fireEvent.mouseUp(targetDropZone);

    // Wait for the drop to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify that dragging has stopped
    const elementStillDragging = draggableItem.classList.contains("is--dragging");
    expect(elementStillDragging).toBe(false);
  },
};
