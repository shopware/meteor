import MtModal from "./mt-modal.vue";
import MtModalRoot from "./sub-components/mt-modal-root.vue";
import MtModalTrigger from "./sub-components/mt-modal-trigger.vue";
import MtModalAction from "./sub-components/mt-modal-action.vue";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
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

  describe("modal stacking", () => {
    const STACKING_WARNING =
      "[MtModal] It is not recommended to stack multiple modals on top of each other.";

    /**
     * Returns the order of backdrops and modals in the body as 'backdrop' | 'modal'.
     * Expected visual hierarchy: each backdrop is followed by its corresponding modal.
     */
    function getBodyStackOrder(): ("backdrop" | "modal")[] {
      const elements = document.body.querySelectorAll(".mt-modal-root__backdrop, .mt-modal");
      return Array.from(elements).map((el) =>
        el.classList.contains("mt-modal") ? "modal" : "backdrop",
      );
    }

    it("does not show stacking warning when only one modal is open", async () => {
      // GIVEN a single modal root
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render({
        components: { MtModal, MtModalRoot, MtModalTrigger },
        template: `
          <mt-modal-root>
            <mt-modal-trigger as="button">Open</mt-modal-trigger>
            <mt-modal title="Single">Content</mt-modal>
          </mt-modal-root>
        `,
      });

      // WHEN opening the modal
      await fireEvent.click(screen.getByRole("button", { name: "Open" }));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // THEN no stacking warning is shown
      expect(warnSpy).not.toHaveBeenCalledWith(STACKING_WARNING);
      warnSpy.mockRestore();
    });

    it("shows stacking warning when opening a second modal", async () => {
      // GIVEN two modal roots
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render({
        components: { MtModal, MtModalRoot, MtModalTrigger },
        setup() {
          const open1 = ref(false);
          const open2 = ref(false);
          return { open1, open2 };
        },
        template: `
          <mt-modal-root :isOpen="open1" @change="(v) => (open1 = v)">
            <mt-modal-trigger as="button">Open 1</mt-modal-trigger>
            <mt-modal title="Modal 1">Content 1</mt-modal>
          </mt-modal-root>
          <mt-modal-root :isOpen="open2" @change="(v) => (open2 = v)">
            <mt-modal-trigger as="button">Open 2</mt-modal-trigger>
            <mt-modal title="Modal 2">Content 2</mt-modal>
          </mt-modal-root>
        `,
      });

      // WHEN opening the first modal
      await fireEvent.click(screen.getByRole("button", { name: "Open 1" }));
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
      expect(warnSpy).not.toHaveBeenCalledWith(STACKING_WARNING);

      // WHEN opening the second modal
      await fireEvent.click(screen.getByRole("button", { name: "Open 2" }));
      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(2);
      });

      // THEN stacking warning is shown
      expect(warnSpy).toHaveBeenCalledWith(STACKING_WARNING);
      warnSpy.mockRestore();
    });

    it("orders modal-root before mt-modal for each pair when opening two modals", async () => {
      // GIVEN two modal roots with modals
      render({
        components: { MtModal, MtModalRoot, MtModalTrigger },
        setup() {
          const open1 = ref(false);
          const open2 = ref(false);
          return { open1, open2 };
        },
        template: `
          <mt-modal-root :isOpen="open1" @change="(v) => (open1 = v)">
            <mt-modal-trigger as="button">Open 1</mt-modal-trigger>
            <mt-modal title="Modal 1">Content 1</mt-modal>
          </mt-modal-root>
          <mt-modal-root :isOpen="open2" @change="(v) => (open2 = v)">
            <mt-modal-trigger as="button">Open 2</mt-modal-trigger>
            <mt-modal title="Modal 2">Content 2</mt-modal>
          </mt-modal-root>
        `,
      });

      // WHEN opening first modal, then second
      await fireEvent.click(screen.getByRole("button", { name: "Open 1" }));
      await fireEvent.click(screen.getByRole("button", { name: "Open 2" }));

      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(2);
      });

      // THEN order in body is backdrop > modal for each pair (visual hierarchy)
      expect(getBodyStackOrder()).toEqual(["backdrop", "modal", "backdrop", "modal"]);
    });

    it("orders modal-root before mt-modal for each pair when opening three modals", async () => {
      // GIVEN three modal roots with modals
      render({
        components: { MtModal, MtModalRoot, MtModalTrigger },
        setup() {
          const open1 = ref(false);
          const open2 = ref(false);
          const open3 = ref(false);
          return { open1, open2, open3 };
        },
        template: `
          <mt-modal-root :isOpen="open1" @change="(v) => (open1 = v)">
            <mt-modal-trigger as="button">Open 1</mt-modal-trigger>
            <mt-modal title="Modal 1">Content 1</mt-modal>
          </mt-modal-root>
          <mt-modal-root :isOpen="open2" @change="(v) => (open2 = v)">
            <mt-modal-trigger as="button">Open 2</mt-modal-trigger>
            <mt-modal title="Modal 2">Content 2</mt-modal>
          </mt-modal-root>
          <mt-modal-root :isOpen="open3" @change="(v) => (open3 = v)">
            <mt-modal-trigger as="button">Open 3</mt-modal-trigger>
            <mt-modal title="Modal 3">Content 3</mt-modal>
          </mt-modal-root>
        `,
      });

      // WHEN opening all three in sequence
      await fireEvent.click(screen.getByRole("button", { name: "Open 1" }));
      await fireEvent.click(screen.getByRole("button", { name: "Open 2" }));
      await fireEvent.click(screen.getByRole("button", { name: "Open 3" }));

      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(3);
      });

      // THEN order in body is backdrop > modal for each pair
      expect(getBodyStackOrder()).toEqual([
        "backdrop",
        "modal",
        "backdrop",
        "modal",
        "backdrop",
        "modal",
      ]);
    });

    it("keeps root-before-modal order after closing a modal and opening it again", async () => {
      // GIVEN two modal roots with modals
      render({
        components: { MtModal, MtModalRoot, MtModalTrigger },
        setup() {
          const open1 = ref(false);
          const open2 = ref(false);
          return { open1, open2 };
        },
        template: `
          <mt-modal-root :isOpen="open1" @change="(v) => (open1 = v)">
            <mt-modal-trigger as="button">Open 1</mt-modal-trigger>
            <mt-modal title="Modal 1">Content 1</mt-modal>
          </mt-modal-root>
          <mt-modal-root :isOpen="open2" @change="(v) => (open2 = v)">
            <mt-modal-trigger as="button">Open 2</mt-modal-trigger>
            <mt-modal title="Modal 2">Content 2</mt-modal>
          </mt-modal-root>
        `,
      });

      // WHEN open first, then second, then close first, then open first again
      await fireEvent.click(screen.getByRole("button", { name: "Open 1" }));
      await fireEvent.click(screen.getByRole("button", { name: "Open 2" }));

      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(2);
      });
      expect(getBodyStackOrder()).toEqual(["backdrop", "modal", "backdrop", "modal"]);

      const closeButtons = screen.getAllByRole("button", { name: "Close" });
      await fireEvent.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(1);
      });

      await fireEvent.click(screen.getByRole("button", { name: "Open 1" }));

      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(2);
      });

      // THEN order in body is still backdrop > modal for each pair
      expect(getBodyStackOrder()).toEqual(["backdrop", "modal", "backdrop", "modal"]);
    });

    it("orders modal-root before mt-modal for nested modals", async () => {
      // GIVEN a modal with a nested modal inside
      render({
        components: { MtModal, MtModalRoot, MtModalTrigger },
        template: `
          <mt-modal-root>
            <mt-modal-trigger as="button">Open Outer</mt-modal-trigger>
            <mt-modal title="Outer Modal">
              <mt-modal-root>
                <mt-modal-trigger as="button">Open Inner</mt-modal-trigger>
                <mt-modal title="Inner Modal">Inner Content</mt-modal>
              </mt-modal-root>
            </mt-modal>
          </mt-modal-root>
        `,
      });

      // WHEN opening the outer modal
      await fireEvent.click(screen.getByRole("button", { name: "Open Outer" }));

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      // WHEN opening the inner modal
      await fireEvent.click(screen.getByRole("button", { name: "Open Inner" }));

      await waitFor(() => {
        expect(screen.getAllByRole("dialog")).toHaveLength(2);
      });

      // THEN order in body is backdrop > modal for each pair
      expect(getBodyStackOrder()).toEqual(["backdrop", "modal", "backdrop", "modal"]);
    });
  });
});
