import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import MtFieldCopyable from "./mt-field-copyable.vue";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

describe("mt-field-copyable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies the text to the clipboard and says so", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    mockClipboard(writeText);
    const wrapper = mount(MtFieldCopyable, {
      props: { copyableText: "the-secret", tooltip: true },
    });

    await wrapper.find(".mt-field-copyable").trigger("click");
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith("the-secret");
    expect(wrapper.vm.wasCopied).toBe(true);
  });

  it("does not say the text was copied when the clipboard refuses it", async () => {
    mockClipboard(() => Promise.reject(new Error("not allowed")));
    const wrapper = mount(MtFieldCopyable, {
      props: { copyableText: "the-secret", tooltip: true },
    });

    await wrapper.find(".mt-field-copyable").trigger("click");
    await flushPromises();

    expect(wrapper.vm.wasCopied).toBe(false);
  });
});
