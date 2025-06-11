import { mount } from "@vue/test-utils";
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

  it("is enabled by default", async () => {
    wrapper = await createWrapper();
    const datepickerInput = wrapper.find(".dp__input");

    expect(datepickerInput.attributes().disabled).toBeUndefined();
  });

  it("is disabled", async () => {
    wrapper = await createWrapper({
      props: {
        disabled: true,
      },
    });
    const datepickerInput = wrapper.find(".dp__input");

    expect(datepickerInput.attributes()).toHaveProperty("disabled");
  });

  it("shows the date format as a placeholder when no placeholder is explictly defined", async () => {
    wrapper = await createWrapper();
    const datepickerInput = wrapper.find(".dp__input");

    expect(datepickerInput.attributes().placeholder).toBe("Y-m-d ...");
  });

  it("shows the placeholder when provided", async () => {
    const placeholderText = "Stop! Hammertime!";
    wrapper = await createWrapper({
      props: {
        placeholder: placeholderText,
      },
    });
    const datepickerInput = wrapper.find(".dp__input");

    expect(datepickerInput.attributes().placeholder).toBe(placeholderText);
  });

  it("should not show the timezone if datepicker is configured for date only", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "date",
        timeZone: "Europe/Berlin",
      },
    });

    const timeZoneHint = wrapper.find('[data-test="time-zone-hint"]');
    expect(timeZoneHint.exists()).toBeFalsy();
  });

  it("should show the timezone if datepicker is configured to datetime", async () => {
    wrapper = await createWrapper({
      props: {
        timeZone: "Europe/Berlin",
        dateType: "datetime",
      },
    });

    const timeZoneHint = wrapper.find('[data-test="time-zone-hint"]');
    expect(timeZoneHint.exists()).toBeTruthy();
    expect(timeZoneHint.text()).toBe("Europe/Berlin");
  });

  it("should output time only when dateType is time", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "time",
        modelValue: "14:30",
      },
    });

    const datepickerInput = wrapper.find(".dp__input");
    expect(datepickerInput.attributes().value).toBe("14:30");
  });

  it("should output time only when ISO string is provided and in time mode", async () => {
    wrapper = await createWrapper({
      props: {
        dateType: "time",
        modelValue: "2024-03-20T14:30:00Z",
      },
    });

    const datepickerInput = wrapper.find(".dp__input");
    expect(datepickerInput.attributes().value).toBe("14:30");
  });
});
