import { defineComponent, h, nextTick, ref } from "vue";
import { fireEvent, render, screen } from "@testing-library/vue";
import MtSnackbar from "./mt-snackbar.vue";
import MtSnackbarNotification from "./_internal/mt-snackbar-notification.vue";
import { useSnackbar } from "./composables/use-snackbar";

describe("mt-snackbar", () => {
  afterEach(() => {
    useSnackbar().clearSnackbars();
    vi.useRealTimers();
  });

  it("shows a notification once even when several hosts are mounted", async () => {
    // ARRANGE
    render(defineComponent({ render: () => [h(MtSnackbar), h(MtSnackbar)] }));

    // ACT
    useSnackbar().addSnackbar({ message: "Saved successfully" });
    await nextTick();

    // ASSERT
    expect(screen.getAllByText("Saved successfully")).toHaveLength(1);
  });

  it("keeps showing notifications when the first host goes away", async () => {
    // ARRANGE
    const showFirst = ref(true);
    render(
      defineComponent({
        render: () => [
          showFirst.value ? h(MtSnackbar, { key: "first" }) : null,
          h(MtSnackbar, { key: "second" }),
        ],
      }),
    );
    useSnackbar().addSnackbar({ message: "Saved successfully" });
    await nextTick();

    // ACT
    showFirst.value = false;
    await nextTick();

    // ASSERT
    expect(screen.getAllByText("Saved successfully")).toHaveLength(1);
  });

  describe("link action", () => {
    beforeEach(() => {
      // Vue drops events older than its listener, so the clock behind event timestamps stays real
      vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    });

    it("runs the action handler and removes the snackbar when the action is a button", async () => {
      // ARRANGE
      const onClick = vi.fn();
      render(MtSnackbar);
      useSnackbar().addSnackbar({ message: "Item deleted", link: { text: "Undo", onClick } });
      await nextTick();

      // ACT
      await fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      // Wait for the exit animation, well before the auto-dismiss timer
      await vi.advanceTimersByTimeAsync(500);

      // ASSERT
      expect(onClick).toHaveBeenCalledOnce();
      expect(useSnackbar().snackbars.value).toHaveLength(0);
    });

    it("renders a link with a url as an anchor and removes the snackbar when clicked", async () => {
      // ARRANGE
      render(MtSnackbar);
      useSnackbar().addSnackbar({ message: "Saved", link: { text: "View", url: "#details" } });
      await nextTick();
      const link = screen.getByRole("link", { name: "View" });

      // ACT
      await fireEvent.click(link);
      await vi.advanceTimersByTimeAsync(500);

      // ASSERT
      expect(link).toHaveAttribute("href", "#details");
      expect(useSnackbar().snackbars.value).toHaveLength(0);
    });

    it("runs the action handler once when the action is clicked twice", async () => {
      // ARRANGE
      const onClick = vi.fn();
      render(MtSnackbar);
      useSnackbar().addSnackbar({ message: "Item deleted", link: { text: "Undo", onClick } });
      await nextTick();
      const button = screen.getByRole("button", { name: "Undo" });

      // ACT
      await fireEvent.click(button);
      await fireEvent.click(button);

      // ASSERT
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("emits the removal once when the auto-dismiss timer fires after the action", async () => {
      // ARRANGE
      const snackbar = useSnackbar().addSnackbar({
        message: "Item deleted",
        duration: 1000,
        link: { text: "Undo", onClick: vi.fn() },
      });
      const { emitted } = render(MtSnackbarNotification, { props: { snackbar } });

      // ACT
      await fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      // Run past the auto-dismiss timer and its exit animation
      await vi.advanceTimersByTimeAsync(2000);

      // ASSERT
      expect(emitted()["remove-snackbar"]).toHaveLength(1);
    });

    it("runs the action handler when it is clicked during the auto-dismiss exit animation", async () => {
      // ARRANGE
      const onClick = vi.fn();
      render(MtSnackbar);
      useSnackbar().addSnackbar({
        message: "Item deleted",
        duration: 1000,
        link: { text: "Undo", onClick },
      });
      await nextTick();
      // Let the auto-dismiss timer start the exit animation
      await vi.advanceTimersByTimeAsync(1000);

      // ACT
      await fireEvent.click(screen.getByRole("button", { name: "Undo" }));

      // ASSERT
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("pauses auto-dismiss while the action has keyboard focus", async () => {
      // ARRANGE
      render(MtSnackbar);
      useSnackbar().addSnackbar({
        message: "Item deleted",
        duration: 1000,
        link: { text: "Undo", onClick: vi.fn() },
      });
      await nextTick();
      const button = screen.getByRole("button", { name: "Undo" });

      // ACT
      button.focus();
      await vi.advanceTimersByTimeAsync(2000);

      // ASSERT
      expect(useSnackbar().snackbars.value).toHaveLength(1);

      // ACT
      button.blur();
      // Run past the remaining time and the exit animation
      await vi.advanceTimersByTimeAsync(2000);

      // ASSERT
      expect(useSnackbar().snackbars.value).toHaveLength(0);
    });

    it("resumes auto-dismiss of other snackbars after the focused snackbar is removed", async () => {
      // ARRANGE
      render(MtSnackbar);
      useSnackbar().addSnackbar({ message: "Still here", duration: 1000 });
      useSnackbar().addSnackbar({
        message: "Item deleted",
        duration: 1000,
        link: { text: "Undo", onClick: vi.fn() },
      });
      await nextTick();
      const button = screen.getByRole("button", { name: "Undo" });
      button.focus();

      // ACT
      await fireEvent.click(button);
      // Remove the clicked snackbar, then run past the other one's timer and exit animation
      await vi.advanceTimersByTimeAsync(500);
      await vi.advanceTimersByTimeAsync(2000);

      // ASSERT
      expect(useSnackbar().snackbars.value).toHaveLength(0);
    });
  });
});
