import { within, expect, userEvent, waitFor } from "@storybook/test";
import { defineStory } from "@/_internal/story-helper";
import { ref } from "vue";
import MtApp from "./mt-app.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtPopover from "../mt-popover/mt-popover.vue";
import MtPopoverItem from "../mt-popover-item/mt-popover-item.vue";
import MtModal from "../mt-modal/mt-modal.vue";
import MtModalRoot from "../mt-modal/sub-components/mt-modal-root.vue";
import MtModalTrigger from "../mt-modal/sub-components/mt-modal-trigger.vue";
import MtSelect from "../mt-select/mt-select.vue";
import { useSnackbar } from "../mt-snackbar/composables/use-snackbar";
import meta, { Default, SlotPlaceholder, type MtAppMeta, type MtAppStory } from "./mt-app.stories";

export default {
  ...meta,
  title: "Components/App/Interaction tests",
  beforeEach: () => useSnackbar().clearSnackbars(),
} as MtAppMeta;

const startTrigger = { name: "Open Primary sidebar" };

function topmostElementAt(element: Element) {
  const rect = element.getBoundingClientRect();

  return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

async function openStartDrawer(canvas: ReturnType<typeof within>) {
  await userEvent.click(canvas.getByRole("button", startTrigger));

  const drawer = await within(document.body).findByRole("dialog", { name: "Primary sidebar" });
  await waitFor(() => expect(drawer).toBeVisible());
  await waitFor(() => expect(drawer.className).not.toContain("mt-drawer-slide-enter"));

  return drawer;
}

export const VisualTestDesktop: MtAppStory = {
  ...Default,
  name: "Render the desktop layout",
};

export const VisualTestMobileDrawerOpen: MtAppStory = {
  ...Default,
  name: "Render the open drawer in the mobile layout",
  play: async ({ canvasElement }) => {
    await openStartDrawer(within(canvasElement));
  },
};

export const TestDrawerFocus: MtAppStory = {
  ...Default,
  name: "Moves the focus into the open drawer and back to its trigger on Escape",
  args: {
    mobileBreakpoint: 99999,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", startTrigger);

    const drawer = await openStartDrawer(canvas);

    await waitFor(() => expect(drawer).toHaveFocus());
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-controls", drawer.id);
    expect(canvas.getByRole("main").closest("[inert]")).not.toBeNull();

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(drawer).not.toBeVisible());
    expect(canvas.getByRole("main").closest("[inert]")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const TestOverlayLayering = defineStory<MtAppMeta>(
  {
    name: "Layers overlays above the drawer and closes one layer per Escape",
    args: {
      mobileBreakpoint: 99999,
    },
    render: (args) => ({
      components: {
        MtApp,
        MtButton,
        MtPopover,
        MtPopoverItem,
        MtModal,
        MtModalRoot,
        MtModalTrigger,
        MtSelect,
        SlotPlaceholder,
      },
      setup() {
        const { addSnackbar } = useSnackbar();
        const shippingMethod = ref("standard");
        const shippingMethods = [
          { label: "Standard", value: "standard" },
          { label: "Express", value: "express" },
        ];

        return { args, MtButton, addSnackbar, shippingMethod, shippingMethods };
      },
      template: `
        <mt-app v-bind="args">
          <template #sidebar-start>
            <slot-placeholder name="sidebar-start" width="15rem">
              <mt-popover title="Filters">
                <template #trigger="{ toggleFloatingUi }">
                  <mt-button variant="secondary" @click.stop="toggleFloatingUi">Filters</mt-button>
                </template>

                <template #popover-items__base>
                  <mt-popover-item label="Open orders" />
                  <mt-popover-item label="Shipped orders" />
                </template>
              </mt-popover>

              <mt-modal-root>
                <mt-modal-trigger :as="MtButton" variant="secondary">Edit order</mt-modal-trigger>

                <mt-modal title="Edit order">
                  <mt-select v-model="shippingMethod" label="Shipping method" :options="shippingMethods" />

                  <template #footer>
                    <mt-button variant="primary" @click="addSnackbar({ message: 'Order saved', variant: 'success' })">
                      Save
                    </mt-button>
                  </template>
                </mt-modal>
              </mt-modal-root>
            </slot-placeholder>
          </template>

          <template #content>
            <slot-placeholder name="content" inset="var(--scale-size-16)" />
          </template>
        </mt-app>
      `,
    }),
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);
      const drawer = await openStartDrawer(canvas);
      const filters = within(drawer).getByRole("button", { name: "Filters" });

      await userEvent.click(filters);
      const popoverItem = await screen.findByText("Shipped orders");
      await waitFor(() => expect(popoverItem.contains(topmostElementAt(popoverItem))).toBe(true));
      await userEvent.click(filters);
      await waitFor(() => expect(screen.queryByText("Shipped orders")).not.toBeInTheDocument());

      await userEvent.click(within(drawer).getByRole("button", { name: "Edit order" }));
      const modal = await screen.findByRole("dialog", { name: "Edit order" });
      await waitFor(() => expect(modal).toHaveFocus());
      expect(modal.contains(topmostElementAt(modal))).toBe(true);
      expect(drawer.closest("[inert]")).not.toBeNull();

      await userEvent.click(within(modal).getByRole("textbox"));
      const option = await screen.findByTestId("mt-select-option--express");
      await waitFor(() => expect(option.contains(topmostElementAt(option))).toBe(true));

      await userEvent.click(within(modal).getByRole("button", { name: "Save" }));
      const snackbar = (await screen.findByText("Order saved")).closest<HTMLElement>(
        ".mt-snackbar-notification",
      )!;
      await waitFor(() => expect(snackbar.contains(topmostElementAt(snackbar))).toBe(true));
      expect(snackbar.closest("[inert]")).toBeNull();

      await userEvent.click(within(modal).getByRole("textbox"));
      await screen.findByTestId("mt-select-option--express");
      await userEvent.keyboard("{Escape}");

      await waitFor(() =>
        expect(screen.queryByTestId("mt-select-option--express")).not.toBeInTheDocument(),
      );
      expect(modal).toBeInTheDocument();

      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(modal).not.toBeInTheDocument());
      expect(drawer).toBeVisible();
      await waitFor(() =>
        expect(within(drawer).getByRole("button", { name: "Edit order" })).toHaveFocus(),
      );

      await userEvent.keyboard("{Escape}");

      await waitFor(() => expect(drawer).not.toBeVisible());
    },
  },
  { from: Default },
);

export const TestDocumentDoesNotScroll = defineStory<MtAppMeta>(
  {
    name: "Scrolls the content panel while the document stays in place",
    render: (args) => ({
      components: { MtApp, SlotPlaceholder },
      setup: () => ({ args }),
      template: `
        <mt-app v-bind="args">
          <template #content>
            <slot-placeholder name="content" inset="var(--scale-size-16)" height="200vh" />
          </template>
        </mt-app>
      `,
    }),
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const main = canvas.getByRole("main");
      const root = document.documentElement;

      expect(getComputedStyle(root).overflowY).toBe("hidden");
      expect(root.scrollHeight).toBe(root.clientHeight);
      expect(main.scrollHeight).toBeGreaterThan(main.clientHeight);
    },
  },
  { from: Default },
);
