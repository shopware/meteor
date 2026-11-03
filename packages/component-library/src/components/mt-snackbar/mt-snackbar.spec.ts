import { defineComponent, h, nextTick, ref } from "vue";
import { fireEvent, render, screen } from "@testing-library/vue";
import MtSnackbar from "./mt-snackbar.vue";
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

  it("runs the action handler and removes the snackbar when the action is a button", async () => {
    // ARRANGE
    // Vue drops events older than its listener, so the clock behind event timestamps stays real
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
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
});
