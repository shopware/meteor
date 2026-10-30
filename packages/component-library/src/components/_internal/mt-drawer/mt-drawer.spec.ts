import { defineComponent, nextTick, ref } from "vue";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtDrawer from "./mt-drawer.vue";
import MtDatepicker from "@/components/mt-datepicker/mt-datepicker.vue";

function renderDrawer(content = `<input aria-label="Customer" />`) {
  const Harness = defineComponent({
    components: { MtDrawer, MtDatepicker },
    setup: () => ({ open: ref(false) }),
    template: `
      <button>Outside</button>
      <button @click="open = true">Edit order</button>
      <mt-drawer v-model:open="open" side="end" title="Order details">${content}</mt-drawer>
      <output>{{ open }}</output>
    `,
  });

  render(Harness, { global: { stubs: { transition: false } } });
}

async function openDrawer() {
  await userEvent.click(screen.getByRole("button", { name: "Edit order" }));
  const dialog = await screen.findByRole("dialog", { name: "Order details" });
  await waitFor(() => expect(dialog).toHaveFocus());

  return dialog;
}

describe("mt-drawer", () => {
  it("names the dialog by its title without a description", async () => {
    // ARRANGE
    renderDrawer();

    // ACT
    const dialog = await openDrawer();

    // ASSERT
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("makes the page behind the open drawer inert and returns the focus when it closes", async () => {
    // ARRANGE
    renderDrawer();

    // ACT
    await openDrawer();

    // ASSERT
    expect(
      screen.getByRole("button", { name: "Outside", hidden: true }).closest("[inert]"),
    ).not.toBeNull();

    // ACT
    await userEvent.keyboard("{Escape}");

    // ASSERT
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("false"));
    await waitFor(() => expect(screen.getByRole("button", { name: "Edit order" })).toHaveFocus());
  });

  it("keeps a date picker inside the drawer usable", async () => {
    // ARRANGE
    renderDrawer(`<mt-datepicker label="Delivery date" />`);

    // ACT
    await openDrawer();

    // ASSERT
    const datepickerMenu = document.querySelector(".dp__outer_menu_wrap");

    expect(datepickerMenu).not.toBeNull();
    expect(datepickerMenu?.closest("[inert]")).toBeNull();
  });

  it("closes on the backdrop", async () => {
    // ARRANGE
    renderDrawer();
    await openDrawer();

    // ACT
    await userEvent.click(screen.getByTestId("mt-drawer-backdrop"));

    // ASSERT
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("false"));
  });

  it("leaves Escape alone while it is closed", async () => {
    // ARRANGE
    renderDrawer();
    await nextTick();
    await nextTick();
    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });

    // ACT
    document.body.dispatchEvent(event);

    // ASSERT
    expect(event.defaultPrevented).toBe(false);
  });
});
