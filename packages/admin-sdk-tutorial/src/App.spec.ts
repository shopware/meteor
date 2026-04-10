import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App.vue";

vi.mock("vue-codemirror6", async () => {
  const { defineComponent, h } = await import("vue");

  return {
    default: defineComponent({
      props: {
        modelValue: {
          default: "",
          type: String,
        },
        readonly: {
          default: false,
          type: Boolean,
        },
      },
      emits: ["update:model-value"],
      setup(props, { emit }) {
        return () =>
          h("textarea", {
            onInput: (event: Event) => {
              if (props.readonly) {
                return;
              }

              emit("update:model-value", (event.target as HTMLTextAreaElement).value);
            },
            readOnly: props.readonly,
            value: props.modelValue,
          });
      },
    }),
  };
});

function setDesktopViewport(): void {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 1280,
    writable: true,
  });
  window.dispatchEvent(new Event("resize"));
}

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    clear() {
      entries.clear();
    },
    getItem(key) {
      return entries.get(key) ?? null;
    },
    key(index) {
      return Array.from(entries.keys())[index] ?? null;
    },
    get length() {
      return entries.size;
    },
    removeItem(key) {
      entries.delete(key);
    },
    setItem(key, value) {
      entries.set(key, value);
    },
  };
}

describe("App", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createMemoryStorage(),
    });
    setDesktopViewport();
  });

  it("selects the first lesson when the workspace opens", () => {
    const wrapper = mount(App);

    expect(wrapper.get("h1").text()).toBe("Dispatch your first notification");
    expect(wrapper.find('[data-testid="lesson-tree"]').text()).toContain(
      "Understand hidden locations"
    );
  });

  it("preserves the learner draft while showing and hiding the solution", async () => {
    const wrapper = mount(App);
    const editor = wrapper.get('[data-testid="lesson-editor"] textarea');
    const draftMarker = "// draft typed in App.spec";

    await editor.setValue(`${(editor.element as HTMLTextAreaElement).value}\n${draftMarker}`);

    expect((editor.element as HTMLTextAreaElement).value).toContain(draftMarker);

    await wrapper.get('[data-testid="show-solution-button"]').trigger("click");

    expect(wrapper.get('[data-testid="solution-panel"]').text()).toContain("Read-only compare");
    expect(
      (wrapper.get('[data-testid="solution-panel"] textarea').element as HTMLTextAreaElement).value
    ).toContain("Profile synced");

    await wrapper.get('[data-testid="hide-solution-button"]').trigger("click");

    expect(wrapper.find('[data-testid="solution-panel"]').exists()).toBe(false);
    expect(
      (wrapper.get('[data-testid="lesson-editor"] textarea').element as HTMLTextAreaElement).value
    ).toContain(draftMarker);
  });

  it("opens the restore confirmation before changing the current draft", async () => {
    const wrapper = mount(App);
    const editor = wrapper.get('[data-testid="lesson-editor"] textarea');
    const starterCode = (editor.element as HTMLTextAreaElement).value;

    await editor.setValue(`${starterCode}\n// Restore starter test`);
    await wrapper.get('[data-testid="restore-starter-button"]').trigger("click");

    expect(wrapper.get('[data-testid="restore-confirm-dialog"]').text()).toContain(
      "Restore the starter code for this lesson?"
    );
    expect(
      (wrapper.get('[data-testid="lesson-editor"] textarea').element as HTMLTextAreaElement).value
    ).toContain("Restore starter test");

    await wrapper
      .get('[data-testid="restore-confirm-dialog"] .workspace-confirm-dialog__button--primary')
      .trigger("click");

    expect(
      (wrapper.get('[data-testid="lesson-editor"] textarea').element as HTMLTextAreaElement).value
    ).toBe(starterCode);
  });
});
