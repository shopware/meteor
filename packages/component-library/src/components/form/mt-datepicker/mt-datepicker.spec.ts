import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import MtDatepicker from "./mt-datepicker.vue";

async function createWrapper(customOptions = {}) {
  return mount(MtDatepicker, {
    ...customOptions,
  });
}

describe("src/app/component/form/mt-datepicker", () => {
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

    const field = wrapper.find(".mt-field"); // mt-field currently disabled
    const datepickerInput = wrapper.find(".dp__input");

    expect(field.attributes().disabled).toBeUndefined();
    expect(datepickerInput.attributes().disabled).toBeUndefined();
  });

  it("should show the date format when no placeholderText is provided", async () => {
    wrapper = await createWrapper();
    const datepickerInput = wrapper.find(".dp__input"); // Updated selector

    // Check if placeholder uses default format
    expect(datepickerInput.attributes().placeholder).toBe("Y-m-d");
  });

  it("should show the placeholderText when provided", async () => {
    const placeholderText = "Stop! Hammertime!";
    wrapper = await createWrapper({
      props: {
        placeholder: placeholderText, // Updated prop
      },
    });
    const datepickerInput = wrapper.find(".dp__input"); // Updated selector

    // Check if placeholder uses provided text
    expect(datepickerInput.attributes().placeholder).toBe(placeholderText);
  });

  it("should use the admin locale", async () => {
    wrapper = await createWrapper({
      props: {
        locale: "de", // Set locale to "de"
      },
    });

    // Ensure locale is set correctly
    expect(wrapper.vm.locale).toBe("de");

    await wrapper.setProps({
      locale: "en", // Change locale to "en"
    });
    await flushPromises();

    // Ensure locale is updated correctly
    expect(wrapper.vm.locale).toBe("en");
  });

  it("should show the label from the property", async () => {
    wrapper = await createWrapper({
      props: {
        label: "Label from prop", // Provided label prop
      },
    });

    // Ensure label text matches the prop value
    expect(wrapper.find("label").text()).toBe("Label from prop");
  });

  it("should not show the actual user timezone as a hint when it is not a datetime", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "date", // Not datetime type
        timeZone: "Europe/Berlin",
      },
    });

    const hint = wrapper.find(".mt-field__hint .mt-icon");

    // Ensure no timezone hint is shown
    expect(hint.exists()).toBeFalsy();
  });

  it("should show the UTC timezone as a hint when no timezone was selected and when datetime is datetime", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "datetime", // Set datetime type
      },
    });

    const hint = wrapper.find(".mt-field__hint");
    const clockIcon = hint.find('[data-testid="mt-icon__solid-clock"]');

    // Ensure the hint shows UTC
    expect(hint.text()).toContain("UTC");
    expect(clockIcon.isVisible()).toBeTruthy();
  });

  it("should show the actual user timezone as a hint when datetime is datetime", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin", // Set timezone to Europe/Berlin
        dateType: "datetime", // Set datetime type
      },
    });

    const hint = wrapper.find(".mt-field__hint");
    const clockIcon = hint.find('[data-testid="mt-icon__solid-clock"]');

    // Ensure the hint shows the provided timezone
    expect(hint.text()).toContain("Europe/Berlin");
    expect(clockIcon.isVisible()).toBeTruthy();
  });

  it("should not show the actual user timezone as a hint when the hideHint property is set to true", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin", // Set timezone to Europe/Berlin
        dateType: "datetime", // Set datetime type
        hideHint: true, // hideHint prop set to true
      },
    });

    const hint = wrapper.find(".mt-field__hint .mt-icon");

    // Ensure no hint is shown due to hideHint being true
    expect(hint.exists()).toBeFalsy();
  });

  it("should not show the actual user timezone as a hint when hideHint is false and dateType is not datetime", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin", // Set timezone
      },
    });

    const hint = wrapper.find(".mt-field__hint .mt-icon");

    // Ensure no timezone hint is shown when it's not datetime
    expect(hint.exists()).toBeFalsy();
  });

  it("should not convert the date when a timezone is set (type=date)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00", // Date value
        dateType: "date", // Date type, no timezone conversion
        timeZone: "Europe/Berlin",
      },
    });

    // Check the raw value remains unchanged
    expect(wrapper.vm.modelValue).toBe("2023-03-27T00:00:00.000+00:00");
  });

  it("should not emit a converted date when a timezone is set (type=date)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00", // Date value
        dateType: "date", // Date type, no timezone conversion
        timeZone: "Europe/Berlin",
      },
    });

    wrapper.vm.handleDateInput("2023-03-22T00:00:00.000+00:00");

    // Ensure the emitted value is not converted
    expect(wrapper.emitted("update:modelValue")?.[0]).toStrictEqual([
      "2023-03-22T00:00:00.000+00:00",
    ]);
  });

  it("should not convert the date when a timezone is set (type=time)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00", // Time value
        dateType: "time", // Time type, no timezone conversion
        timeZone: "Europe/Berlin",
      },
    });

    // Ensure the raw time remains unchanged
    expect(wrapper.vm.modelValue).toBe("2023-03-27T00:00:00.000+00:00");
  });

  it("should not emit a converted time when a timezone is set (type=time)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00", // Time value
        dateType: "time", // Time type, no timezone conversion
        timeZone: "Europe/Berlin",
      },
    });

    wrapper.vm.handleDateInput("2023-03-22T00:00:00.000+00:00");

    // Ensure the emitted value is not converted
    expect(wrapper.emitted("update:modelValue")?.[0]).toStrictEqual([
      "2023-03-22T00:00:00.000+00:00",
    ]);
  });

  it("should convert the date when a timezone is set (type=datetime)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00", // DateTime value
        dateType: "datetime", // DateTime type, timezone conversion expected
        timeZone: "Europe/Berlin",
      },
    });

    // Skipping the actual check as it depends on date-fns-tz
     expect(wrapper.vm.modelValue).toBe('2023-03-27T02:00:00.000Z');
  });

  it("should emit a converted date when a timezone is set (type=datetime)", async () => {
    wrapper = await createWrapper({
      props: {
        modelValue: "2023-03-27T00:00:00.000+00:00", // DateTime value
        dateType: "datetime", // DateTime type, timezone conversion expected
        timeZone: "Europe/Berlin",
      },
    });

    wrapper.vm.handleDateInput("2023-03-22T00:00:00.000+00:00");

    // Skipping the actual check as it depends on date-fns-tz
     expect(wrapper.emitted('update:modelValue')?.[0]).toStrictEqual(['2023-03-21T23:00:00.000Z']);
  });
});
