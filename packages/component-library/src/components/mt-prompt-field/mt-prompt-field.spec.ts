import { userEvent } from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/vue";
import { defineComponent, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import MtPromptField from "./mt-prompt-field.vue";
import MtPromptFieldActionMenu from "./mt-prompt-field-action-menu.vue";
import MtPromptFieldAddAttachments from "./mt-prompt-field-add-attachments.vue";
import MtPromptFieldModelSelect from "./mt-prompt-field-model-select.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";

const image = () => new File(["image"], "photo.png", { type: "image/png" });
const pdf = () => new File(["pdf"], "report.pdf", { type: "application/pdf" });

describe("mt-prompt-field", () => {
  it("emits the typed value", async () => {
    const handler = vi.fn();
    render(MtPromptField, { props: { "onUpdate:modelValue": handler } });

    await userEvent.type(screen.getByRole("textbox", { name: "Prompt" }), "a");

    expect(handler).toHaveBeenNthCalledWith(1, "a");
  });

  it("uses the label as the accessible name of the textarea", () => {
    render(MtPromptField, { props: { label: "Message the assistant" } });

    expect(screen.getByRole("textbox", { name: "Message the assistant" })).toBeVisible();
  });

  it("submits the text with Enter and clears the field", async () => {
    const onSubmit = vi.fn();
    render(MtPromptField, { props: { onSubmit } });
    const textbox = screen.getByRole("textbox");

    await userEvent.type(textbox, "Hello{Enter}");

    expect(onSubmit).toHaveBeenNthCalledWith(1, { text: "Hello", files: [] });
    expect(textbox).toHaveValue("");
  });

  it.each([
    ["Shift+Enter", "Hello", "{Shift>}{Enter}{/Shift}"],
    ["a whitespace-only value", "   ", "{Enter}"],
  ])("does not submit with %s", async (_, modelValue, keys) => {
    const onSubmit = vi.fn();
    render(MtPromptField, { props: { modelValue, onSubmit } });

    await userEvent.type(screen.getByRole("textbox"), keys);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits only with Ctrl+Enter in the mod-enter mode", async () => {
    const onSubmit = vi.fn();
    render(MtPromptField, { props: { modelValue: "Hello", submitMode: "mod-enter", onSubmit } });
    const textbox = screen.getByRole("textbox");

    await userEvent.type(textbox, "{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.type(textbox, "{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("submits with the button and returns the focus to the textarea", async () => {
    const onSubmit = vi.fn();
    render(MtPromptField, { props: { modelValue: "Hello", onSubmit } });

    await userEvent.click(screen.getByRole("button", { name: "Submit prompt" }));

    expect(onSubmit).toHaveBeenNthCalledWith(1, { text: "Hello", files: [] });
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("disables the submit button while there is nothing to send", () => {
    render(MtPromptField, { props: { modelValue: "" } });

    expect(screen.getByRole("button", { name: "Submit prompt" })).toBeDisabled();
  });

  it.each(["submitted", "streaming"] as const)(
    "stops instead of submitting while %s",
    async (status) => {
      const onSubmit = vi.fn();
      const onStop = vi.fn();
      render(MtPromptField, { props: { modelValue: "Hello", status, onSubmit, onStop } });

      await userEvent.type(screen.getByRole("textbox"), "{Enter}");
      await userEvent.click(screen.getByRole("button", { name: "Stop prompt" }));

      expect(onSubmit).not.toHaveBeenCalled();
      expect(onStop).toHaveBeenCalledOnce();
      expect(screen.getByRole("textbox")).toHaveFocus();
    },
  );

  it("stops a running request with Escape and marks the key as handled", async () => {
    const onStop = vi.fn();
    render(MtPromptField, { props: { status: "streaming", onStop } });

    const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
    screen.getByRole("textbox").dispatchEvent(event);

    expect(onStop).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  it("swaps the submit and stop icons when the status changes", async () => {
    const { rerender } = render(MtPromptField, {
      props: { modelValue: "Hello" },
      global: { stubs: { transition: false } },
    });

    await rerender({ status: "streaming" });
    await vi.waitFor(() =>
      expect(screen.getByRole("button", { name: "Stop prompt" })).toContainElement(
        screen.getByTestId("mt-icon__solid-square"),
      ),
    );

    await rerender({ status: "ready" });
    await vi.waitFor(() =>
      expect(screen.getByRole("button", { name: "Submit prompt" })).toContainElement(
        screen.getByTestId("mt-icon__solid-paper-plane"),
      ),
    );
  });

  it("disables the textarea and the submit button", () => {
    render(MtPromptField, { props: { modelValue: "Hello", disabled: true } });

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit prompt" })).toBeDisabled();
  });

  it("renders the slots and leaves out an empty header", () => {
    const { container } = render(MtPromptField, {
      slots: {
        tools: "<button>Attach</button>",
        "tools-end": "<button>Model</button>",
      },
    });

    expect(screen.getByRole("button", { name: "Attach" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Model" })).toBeVisible();
    expect(container.querySelector(".mt-prompt-field__header")).toBeNull();
  });

  describe("attachments", () => {
    it("adds pasted files, sends them with the text and clears them", async () => {
      const onSubmit = vi.fn();
      render(MtPromptField, { props: { accept: "image/*", onSubmit } });
      const file = image();

      await fireEvent.paste(screen.getByRole("textbox"), { clipboardData: { files: [file] } });

      expect(screen.getByText("photo.png")).toBeVisible();

      await userEvent.click(screen.getByRole("button", { name: "Submit prompt" }));

      expect(onSubmit).toHaveBeenNthCalledWith(1, { text: "", files: [file] });
      expect(screen.queryByText("photo.png")).toBeNull();
    });

    it("adds dropped files", async () => {
      const { container } = render(MtPromptField, { props: { accept: ".pdf" } });

      await fireEvent.drop(container.querySelector(".mt-prompt-field")!, {
        dataTransfer: { types: ["Files"], files: [pdf()] },
      });

      expect(screen.getByText("report.pdf")).toBeVisible();
    });

    it("ignores files without accept", async () => {
      const onError = vi.fn();
      render(MtPromptField, { props: { onError } });

      await fireEvent.paste(screen.getByRole("textbox"), { clipboardData: { files: [image()] } });

      expect(screen.queryByText("photo.png")).toBeNull();
      expect(onError).not.toHaveBeenCalled();
    });

    it.each([
      ["accept", { accept: ".pdf" }, [image()]],
      ["max_file_size", { accept: "image/*", maxFileSize: 2 }, [image()]],
      ["max_files", { accept: "image/*", maxFiles: 1 }, [image(), image()]],
    ])("rejects files with %s", async (code, props, files) => {
      const onError = vi.fn();
      render(MtPromptField, { props: { ...props, onError } });

      await fireEvent.paste(screen.getByRole("textbox"), { clipboardData: { files } });

      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code }));
    });

    it("removes the last file with Backspace in an empty textarea", async () => {
      const onUpdateFiles = vi.fn();
      render(MtPromptField, {
        props: { accept: "image/*", files: [image(), pdf()], "onUpdate:files": onUpdateFiles },
      });

      await userEvent.type(screen.getByRole("textbox"), "{Backspace}");

      expect(onUpdateFiles).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({ name: "photo.png" }),
      ]);
    });

    it("removes a file with its remove button", async () => {
      render(MtPromptField, { props: { accept: "image/*", files: [image()] } });

      await userEvent.click(screen.getByRole("button", { name: "Remove photo.png" }));

      expect(screen.queryByText("photo.png")).toBeNull();
    });
  });

  describe("parts", () => {
    const Harness = defineComponent({
      components: {
        MtPromptField,
        MtPromptFieldActionMenu,
        MtPromptFieldAddAttachments,
        MtPromptFieldModelSelect,
        MtActionMenuItem,
      },
      props: { onAction: { type: Function, default: () => undefined } },
      setup() {
        const model = ref("standard");
        const models = [
          { value: "standard", label: "Standard", description: "Fast everyday answers" },
          { value: "advanced", label: "Advanced" },
        ];

        return { model, models };
      },
      template: `
        <mt-prompt-field accept="image/*">
          <template #tools>
            <mt-prompt-field-action-menu>
              <mt-prompt-field-add-attachments />
              <mt-action-menu-item @select="onAction">Add context</mt-action-menu-item>
            </mt-prompt-field-action-menu>
          </template>
          <template #tools-end>
            <mt-prompt-field-model-select v-model="model" :models="models" />
          </template>
        </mt-prompt-field>
        <output>{{ model }}</output>
      `,
    });

    it("opens the action menu and runs its items", async () => {
      const onAction = vi.fn();
      render(Harness, { props: { onAction } });

      await userEvent.click(screen.getByRole("button", { name: "Add to prompt" }));
      expect(await screen.findByRole("menuitem", { name: "Attach files" })).toBeVisible();

      await userEvent.click(screen.getByRole("menuitem", { name: "Add context" }));
      expect(onAction).toHaveBeenCalledOnce();
    });

    it("selects a model from the model menu", async () => {
      render(Harness);

      await userEvent.click(screen.getByRole("button", { name: "Model: Standard" }));
      expect(await screen.findByRole("menuitemradio", { name: /Standard/ })).toHaveAttribute(
        "aria-checked",
        "true",
      );

      await userEvent.click(screen.getByRole("menuitemradio", { name: "Advanced" }));
      expect(screen.getByRole("status")).toHaveTextContent("advanced");
    });

    it("renders no model menu for a single model", () => {
      render(MtPromptField, {
        slots: {
          "tools-end": `<mt-prompt-field-model-select :models="[{ value: 'only', label: 'Only' }]" />`,
        },
        global: { components: { MtPromptFieldModelSelect } },
      });

      expect(screen.queryByRole("button", { name: /Model/ })).toBeNull();
    });
  });
});
