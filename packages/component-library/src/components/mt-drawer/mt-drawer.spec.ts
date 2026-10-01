import { defineComponent, nextTick, ref } from "vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtDrawerRoot from "./mt-drawer-root.vue";
import MtDrawerTrigger from "./mt-drawer-trigger.vue";
import MtDrawerContent from "./mt-drawer-content.vue";
import MtDrawerClose from "./mt-drawer-close.vue";

function renderDrawer(options: { dismissible?: boolean } = {}) {
  const onDismissPrevented = vi.fn();

  const Harness = defineComponent({
    components: { MtDrawerRoot, MtDrawerTrigger, MtDrawerContent, MtDrawerClose },
    setup() {
      const open = ref(false);

      return { open, dismissible: options.dismissible ?? true, onDismissPrevented };
    },
    template: `
      <button>Outside</button>
      <mt-drawer-root
        v-model:open="open"
        :dismissible="dismissible"
        @dismiss-prevented="onDismissPrevented"
      >
        <mt-drawer-trigger>Edit order</mt-drawer-trigger>

        <mt-drawer-content title="Order details">
          <input aria-label="Customer" />

          <template #footer>
            <mt-drawer-close>Done</mt-drawer-close>
          </template>
        </mt-drawer-content>
      </mt-drawer-root>
      <output>{{ open }}</output>
    `,
  });

  render(Harness);

  return { onDismissPrevented };
}

async function openDrawer() {
  await userEvent.click(screen.getByRole("button", { name: "Edit order" }));
  const dialog = await screen.findByRole("dialog", { name: "Order details" });
  await waitFor(() => expect(dialog).toHaveFocus());

  return dialog;
}

describe("mt-drawer", () => {
  it("opens from the trigger and closes with the close button", async () => {
    // ARRANGE
    renderDrawer();
    await openDrawer();

    // ACT
    await userEvent.click(screen.getByRole("button", { name: "Done" }));

    // ASSERT
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("status")).toHaveTextContent("false");
    await waitFor(() => expect(screen.getByRole("button", { name: "Edit order" })).toHaveFocus());
  });

  it("makes the page behind the open drawer inert", async () => {
    // ARRANGE
    renderDrawer();

    // ACT
    await openDrawer();

    // ASSERT
    expect(
      screen.getByRole("button", { name: "Outside", hidden: true }).closest("[inert]"),
    ).not.toBeNull();
  });

  it("closes on Escape and on the backdrop", async () => {
    // ARRANGE
    renderDrawer();
    await openDrawer();

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("false"));

    // ACT
    await openDrawer();
    await userEvent.click(screen.getByTestId("mt-drawer-backdrop"));

    // ASSERT
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("false"));
  });

  it("leaves Escape alone while a kept mounted drawer is closed", async () => {
    // ARRANGE
    render(
      defineComponent({
        components: { MtDrawerRoot, MtDrawerContent },
        template: `
          <mt-drawer-root>
            <mt-drawer-content title="Order details" keep-mounted>Details</mt-drawer-content>
          </mt-drawer-root>
        `,
      }),
    );
    await nextTick();
    await nextTick();
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });

    // ACT
    document.body.dispatchEvent(event);

    // ASSERT
    expect(event.defaultPrevented).toBe(false);
  });

  it("stays open and reports the reason when it is not dismissible", async () => {
    // ARRANGE
    const { onDismissPrevented } = renderDrawer({ dismissible: false });
    await openDrawer();

    // ACT
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByTestId("mt-drawer-backdrop"));
    await nextTick();

    // ASSERT
    expect(screen.getByRole("status")).toHaveTextContent("true");
    expect(onDismissPrevented.mock.calls).toEqual([
      [{ reason: "escape-key" }],
      [{ reason: "outside-click" }],
    ]);
  });
});
