import { defineComponent, h, nextTick, ref } from "vue";
import { render, screen } from "@testing-library/vue";
import MtSnackbar from "./mt-snackbar.vue";
import { useSnackbar } from "./composables/use-snackbar";

describe("mt-snackbar", () => {
  afterEach(() => {
    useSnackbar().clearSnackbars();
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
});
