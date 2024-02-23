import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import SwDatepicker from "./sw-datepicker.vue";

async function createWrapper(customOptions = {}) {
  return mount(SwDatepicker, {
    ...customOptions,
  });
}

describe("src/app/component/form/sw-datepicker", () => {
  let wrapper: undefined | Awaited<ReturnType<typeof createWrapper>>;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("should be a Vue.JS component", async () => {
    wrapper = await createWrapper();
    expect(wrapper.vm).toBeTruthy();
  });

  it("should have enabled links", async () => {
    wrapper = await createWrapper();

    const field = wrapper.find(".sw-field");
    const flatpickrInput = wrapper.find(".flatpickr-input");

    expect(field.attributes().disabled).toBeUndefined();
    expect(flatpickrInput.attributes().disabled).toBeUndefined();
  });

  it("should show the dateformat, when no placeholderText is provided", async () => {
    wrapper = await createWrapper();
    const flatpickrInput = wrapper.find(".flatpickr-input");

    expect(flatpickrInput.attributes().placeholder).toBe("Y-m-d");
  });

  it("should show the placeholderText, when provided", async () => {
    const placeholderText = "Stop! Hammertime!";
    wrapper = await createWrapper({
      props: {
        placeholderText,
      },
    });
    const flatpickrInput = wrapper.find(".flatpickr-input");

    expect(flatpickrInput.attributes().placeholder).toBe(placeholderText);
  });

  it("should use the admin locale", async () => {
    wrapper = await createWrapper({
      props: {
        locale: "de",
      },
    });

    // @ts-expect-error
    expect(wrapper.vm.$data.flatpickrInstance.config.locale).toBe("de");

    await wrapper.setProps({
      locale: "en",
    });
    await flushPromises();

    // @ts-expect-error
    expect(wrapper.vm.$data.flatpickrInstance.config.locale).toBe("en");
  });

  it("should show the label from the property", async () => {
    wrapper = await createWrapper({
      props: {
        label: "Label from prop",
      },
    });

    expect(wrapper.find("label").text()).toBe("Label from prop");
  });

  it("should not show the actual user timezone as a hint when it is not a datetime", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    const hint = wrapper.find(".sw-field__hint .sw-icon");

    expect(hint.exists()).toBeFalsy();
  });

  it("should show the UTC timezone as a hint when no timezone was selected and when datetime is datetime", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "datetime",
      },
    });

    const hint = wrapper.find(".sw-field__hint");
    const clockIcon = hint.find('[data-testid="sw-icon__solid-clock"]');

    expect(hint.text()).toContain("UTC");
    expect(clockIcon.isVisible()).toBeTruthy();
  });

  it("should show the actual user timezone as a hint when datetime is datetime", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin",
        dateType: "datetime",
      },
    });

    const hint = wrapper.find(".sw-field__hint");
    const clockIcon = hint.find('[data-testid="sw-icon__solid-clock"]');

    expect(hint.text()).toContain("Europe/Berlin");
    expect(clockIcon.isVisible()).toBeTruthy();
  });

  it("should not show the actual user timezone as a hint when the hideHint property is set to true", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin",
        dateType: "datetime",
        hideHint: true,
      },
    });

    const hint = wrapper.find(".sw-field__hint .sw-icon");

    expect(hint.exists()).toBeFalsy();
  });

  it("should not show the actual user timezone as a hint when hideHint is false and dateType is not dateTime", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin",
      },
    });

    const hint = wrapper.find(".sw-field__hint .sw-icon");

    expect(hint.exists()).toBeFalsy();
  });

  it("should not convert the date when a timezone is set (type=date)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00",
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    // Can't test with DOM because of the flatpickr dependency
    expect(wrapper.vm.timezoneFormattedValue).toBe("2023-03-27T00:00:00.000+00:00");
  });

  it("should not emit a converted date when a timezone is set (type=date)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00",
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    // can't test with DOM because of the flatpickr dependency
    wrapper.vm.timezoneFormattedValue = "2023-03-22T00:00:00.000+00:00";

    expect(wrapper.emitted("update:modelValue")?.[0]).toStrictEqual([
      "2023-03-22T00:00:00.000+00:00",
    ]);
  });

  it("should not convert the date when a timezone is set (type=time)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00",
        dateType: "time",
        timeZone: "Europe/Berlin",
      },
    });

    // Can't test with DOM because of the flatpickr dependency
    expect(wrapper.vm.timezoneFormattedValue).toBe("2023-03-27T00:00:00.000+00:00");
  });

  it("should not emit a converted date when a timezone is set (type=time)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00",
        dateType: "time",
        timeZone: "Europe/Berlin",
      },
    });

    // can't test with DOM because of the flatpickr dependency
    wrapper.vm.timezoneFormattedValue = "2023-03-22T00:00:00.000+00:00";

    expect(wrapper.emitted("update:modelValue")?.[0]).toStrictEqual([
      "2023-03-22T00:00:00.000+00:00",
    ]);
  });

  it("should convert the date when a timezone is set (type=datetime)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00",
        dateType: "datetime",
        timeZone: "Europe/Berlin",
      },
    });

    // Skip this test because data-fns-tz is not working correctly in the test environment
    // Can't test with DOM because of the flatpickr dependency
    // expect(wrapper.vm.timezoneFormattedValue).toStrictEqual('2023-03-27T02:00:00.000Z');
  });

  it("should emit a converted date when a timezone is set (type=datetime)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00",
        dateType: "datetime",
        timeZone: "Europe/Berlin",
      },
    });

    // can't test with DOM because of the flatpickr dependency
    wrapper.vm.timezoneFormattedValue = "2023-03-22T00:00:00.000+00:00";

    // Skip this test because data-fns-tz is not working correctly in the test environment
    // expect(wrapper.emitted('update:modelValue')[0]).toStrictEqual(['2023-03-21T23:00:00.000Z']);
  });
});
