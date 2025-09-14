import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MtPromoBadge from "./mt-promo-badge.vue";

describe("mt-promo-badge", () => {
  it("renders with default props", () => {
    const wrapper = mount(MtPromoBadge, {
      slots: {
        default: "New",
      },
    });

    expect(wrapper.text()).toBe("New");
    expect(wrapper.classes()).toContain("mt-promo-badge");
    expect(wrapper.classes()).toContain("mt-promo-badge--new");
    expect(wrapper.classes()).toContain("mt-promo-badge--medium");
  });

  it("renders with different variants", () => {
    const variants = ["new", "beta", "shopware-ai"] as const;

    variants.forEach((variant) => {
      const wrapper = mount(MtPromoBadge, {
        props: { variant },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.classes()).toContain(`mt-promo-badge--${variant}`);
    });
  });

  it("renders with different sizes", () => {
    const sizes = ["small", "medium", "large"] as const;

    sizes.forEach((size) => {
      const wrapper = mount(MtPromoBadge, {
        props: { size },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.classes()).toContain(`mt-promo-badge--${size}`);
    });
  });

  it("renders slot content", () => {
    const slotContent = "Custom Badge Text";
    const wrapper = mount(MtPromoBadge, {
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toBe(slotContent);
  });

  it("applies custom attributes", () => {
    const wrapper = mount(MtPromoBadge, {
      attrs: {
        "data-testid": "promo-badge",
        id: "test-badge",
      },
      slots: {
        default: "Test",
      },
    });

    expect(wrapper.attributes("data-testid")).toBe("promo-badge");
    expect(wrapper.attributes("id")).toBe("test-badge");
  });

  it("has correct HTML structure", () => {
    const wrapper = mount(MtPromoBadge, {
      slots: {
        default: "Test Badge",
      },
    });

    expect(wrapper.element.tagName).toBe("SPAN");
    expect(wrapper.classes()).toContain("mt-promo-badge");
  });

  it("combines multiple props correctly", () => {
    const wrapper = mount(MtPromoBadge, {
      props: {
        variant: "beta",
        size: "large",
      },
      slots: {
        default: "Beta Badge",
      },
    });

    expect(wrapper.classes()).toContain("mt-promo-badge--beta");
    expect(wrapper.classes()).toContain("mt-promo-badge--large");
    expect(wrapper.text()).toBe("Beta Badge");
  });

  it("renders with correct icon for each variant", () => {
    const iconConfig = {
      new: "solid-sparkles",
      beta: "solid-flask",
      "shopware-ai": "solid-robot",
    };

    Object.entries(iconConfig).forEach(([variant, expectedIcon]) => {
      const wrapper = mount(MtPromoBadge, {
        props: { variant: variant as any },
        slots: {
          default: "Test",
        },
      });

      const icon = wrapper.findComponent({ name: "mt-icon" });
      expect(icon.exists()).toBe(true);
      expect(icon.props("name")).toBe(expectedIcon);
    });
  });
});
