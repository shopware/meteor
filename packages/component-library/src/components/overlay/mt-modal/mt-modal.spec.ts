import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtModalAction from "./sub-components/mt-modal-action.vue";
import { render, screen, fireEvent } from "@testing-library/vue";
import { ref } from "vue";

describe("mt-modal", () => {
  it("the modal is hidden by default", () => {
    // GIVEN
    render({
      components: { MtModal, MtModalRoot, MtModalTrigger },
      template: `
<mt-modal-root>
  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    // WHEN
    const modal = screen.queryByRole("dialog");

    // THEN
    expect(modal).not.toBeInTheDocument();
  });

  it("the modal is visible by default", () => {
    // GIVEN
    render({
      components: { MtModal, MtModalRoot },
      template: `
<mt-modal-root isOpen>
  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    // WHEN
    const modal = screen.queryByRole("dialog");

    // THEN
    expect(modal).toBeInTheDocument();
  });

  it("opens the modal when clicking the trigger", async () => {
    // GIVEN
    const onChange = vi.fn();

    render({
      components: { MtModal, MtModalRoot, MtModalTrigger },
      setup() {
        return { onChange };
      },
      template: `
<mt-modal-root @change="onChange">
  <mt-modal-trigger as='button'>Open modal</mt-modal-trigger>

  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    // WHEN
    await fireEvent.click(screen.getByRole("button"));

    // THEN
    const modal = screen.queryByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(onChange).toHaveBeenNthCalledWith(1, true);
  });

  it("opens the modal when clicking the trigger when 'isOpen' gets changed", async () => {
    // GIVEN
    const onChange = vi.fn();

    render({
      components: { MtModal, MtModalRoot, MtModalTrigger },
      setup() {
        const isOpen = ref(false);
        return { onChange, isOpen };
      },
      template: `
      <button @click="isOpen = !isOpen">Toggle modal</button>
<mt-modal-root @change="onChange" :isOpen="isOpen">
  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // WHEN
    await fireEvent.click(screen.getByRole("button"));

    // THEN
    const modal = screen.queryByRole("dialog");
    expect(modal).toBeInTheDocument();
    expect(onChange).toHaveBeenNthCalledWith(1, true);
  });

  it("closes the modal", async () => {
    const onChange = vi.fn();

    // GIVEN
    render({
      components: { MtModal, MtModalRoot, MtModalTrigger },
      setup() {
        return { onChange };
      },
      template: `
<mt-modal-root @change='onChange'>
  <mt-modal-trigger as='button'>Open modal</mt-modal-trigger>

  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    await fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    // WHEN
    await fireEvent.click(screen.getByRole("button", { name: "Close" }));

    // THEN
    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("closes the modal through an action button", async () => {
    // GIVEN
    render({
      components: { MtModal, MtModalRoot, MtModalTrigger, MtModalAction },
      template: `
<mt-modal-root>
  <mt-modal-trigger as="button">Open modal</mt-modal-trigger>

  <mt-modal title='title'>
    <template #default>mt-modal works!</template>

    <template #footer>
      <mt-modal-action as="button" @click="done => done()">Confirm</mt-modal-action>
    </template>
  </mt-modal>
</mt-modal-root>`,
    });

    await fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    // WHEN
    await fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    // THEN
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal when pressing escape", async () => {
    // GIVEN
    render({
      components: { MtModal, MtModalRoot, MtModalTrigger },
      template: `
<mt-modal-root>
  <mt-modal-trigger as='button'>Open modal</mt-modal-trigger>

  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    await fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    // WHEN
    await fireEvent.keyDown(document, { key: "Escape" });

    // THEN
    const modal = screen.queryByRole("dialog");
    expect(modal).not.toBeInTheDocument();
  });

  it("closes the modal when clicking on the backdrop", async () => {
    // GIVEN
    render({
      components: { MtModal, MtModalRoot, MtModalTrigger },
      template: `
<mt-modal-root>
  <mt-modal-trigger as='button'>Open modal</mt-modal-trigger>

  <mt-modal title='title'>mt-modal works!</mt-modal>
</mt-modal-root>`,
    });

    await fireEvent.click(screen.getByRole("button", { name: "Open modal" }));

    // WHEN
    await fireEvent.click(screen.getByTestId("modal-backdrop"));

    // THEN
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
