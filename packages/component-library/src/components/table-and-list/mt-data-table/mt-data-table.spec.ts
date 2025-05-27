import { mount } from "@vue/test-utils";
import MtDataTable, { type ColumnDefinition } from "./mt-data-table.vue";
import MtDataTableFixtures from "./mt-data-table.fixtures.json";
import flushPromises from "flush-promises";
import { get } from "@/utils/object";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useI18n } from "vue-i18n";

// Mock "useDebounceFn" from "@vueuse/core"
vi.mock("@vueuse/core", () => ({
  useDebounceFn: (method: () => void) => {
    return method;
  },
}));

vi.mock("vue-i18n", () => ({
  useI18n: vi.fn(() => {
    return {
      t: (tKey: string) => tKey,
    };
  }),
}));

const columnsFixture: ColumnDefinition[] = [
  {
    label: "Name",
    property: "name",
    renderer: "text",
    position: 0,
    width: 200,
  },
  {
    label: "Manufacturer",
    property: "manufacturer.name",
    renderer: "text",
    position: 100,
  },
  {
    label: "Active",
    property: "active",
    renderer: "badge",
    rendererOptions: {
      renderItemBadge: (data, columnDefinition) => {
        // @ts-expect-error
        const value = get(data, columnDefinition.property);

        return value
          ? {
              variant: "positive",
              label: "Active",
            }
          : {
              variant: "critical",
              label: "Inactive",
            };
      },
    },
    position: 200,
    width: 123,
    allowResize: false,
  },
  {
    label: "Price",
    property: "price",
    renderer: "price",
    position: 300,
    rendererOptions: {
      currencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
      currencyISOCode: "EUR",
      source: "net",
    },
  },
  {
    label: "Stock",
    property: "stock",
    renderer: "number",
    position: 400,
    width: 100,
  },
  {
    label: "Available",
    property: "available",
    renderer: "number",
    position: 500,
    width: 100,
  },
];

const DEFAULT_MIN_WIDTH = "100px";

// mock resizeOvserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

function createWrapper() {
  return mount(MtDataTable, {
    attachTo: document.body,
    props: {
      dataSource: MtDataTableFixtures,
      columns: columnsFixture,
      title: "Data table",
      subtitle: "This is the subline",
      currentPage: 1,
      paginationTotalItems: 182,
      paginationLimit: 25,
    },
    global: {
      mocks: {
        $t: (v: string) => v,
      },
      stubs: {
        "mt-icon": true,
      },
    },
  });
}

describe("mt-data-table", () => {
  beforeEach(() => {
    // @ts-expect-error - mock was set via jest
    if (console.error.mockRestore) {
      // @ts-expect-error - mock was set via jest
      console.error.mockRestore();
    }

    // reset global styling
    document.body.style.cursor = "";

    // @ts-expect-error
    if (window.removeEventListener.mockReset) {
      // @ts-expect-error
      window.removeEventListener.mockReset();
    }
  });

  afterEach(async () => {
    await flushPromises();
  });

  it("should render the component", () => {
    const wrapper = createWrapper();

    expect(wrapper.vm).toBeTruthy();
  });

  describe("should throw an console error if columns aren't correctly defined", () => {
    it("missing label", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          // @ts-expect-error - validator check
          {
            property: "name",
            renderer: "text",
            position: 0,
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("missing property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          // @ts-expect-error - validator check
          {
            label: "name",
            renderer: "text",
            position: 0,
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("missing renderer", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          // @ts-expect-error - validator check
          {
            label: "name",
            property: "name",
            position: 0,
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("missing position", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          // @ts-expect-error - validator check
          {
            label: "name",
            property: "name",
            renderer: "text",
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong label property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            // @ts-expect-error - validator check
            label: 1,
            property: "name",
            renderer: "text",
            position: 0,
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong property property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            // @ts-expect-error - validator check
            property: 1,
            renderer: "text",
            position: 0,
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong renderer property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "name",
            property: "name",
            // @ts-expect-error - validator check
            renderer: 1,
            position: 0,
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong position property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            // @ts-expect-error - validator check
            position: "0",
            width: 200,
          },
        ],
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });
  });

  describe("should render the table header cells correctly", () => {
    it("should render table header cells everytime with 'fit-content' in the 'max-width' property", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
            width: 200,
          },
        ],
      });

      const firstColumnHeader = wrapper.findAll("th").at(0);
      expect(firstColumnHeader?.attributes().style).toContain("max-width: fit-content");
    });
    it("should render table header cells with default minimum column width and auto main width when given width is undefined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
          },
        ],
      });

      const firstColumnHeader = wrapper.findAll("th").at(0);
      expect(firstColumnHeader?.attributes().style).toContain(`min-width: ${DEFAULT_MIN_WIDTH}`);
      expect(firstColumnHeader?.attributes().style).toContain("width: auto");
    });
    it("should render table header cells with defined column width when width is defined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
            width: 789,
          },
        ],
      });

      const firstColumnHeader = wrapper.findAll("th").at(0);
      expect(firstColumnHeader?.attributes().style).toContain("min-width: 789px");
      expect(firstColumnHeader?.attributes().style).toContain("width: 789px");
    });
  });

  describe("should render the table data cells correctly", () => {
    it("should render table data cells with 'max-width' to 'auto' when 'cellWrap' is 'normal'", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
            width: 789,
            cellWrap: "normal",
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain("max-width: auto");
    });
    it("should render table data cells with 'max-width' to 'XXXpx' when 'cellWrap' is 'nowrap' and 'width' is defined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
            width: 789,
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain("max-width: 789px");
    });
    it("should render table data cells with 'max-width' to fallback width when 'cellWrap' is 'nowrap' and 'width' is undefined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain(`max-width: ${DEFAULT_MIN_WIDTH}`);
    });
    it("should render table data cells with nowrap white-space when cellWrap is undefined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain("white-space: nowrap");
    });
    it("should render table data cells with 'normal' white-space when cellWrap is 'normal'", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
            cellWrap: "normal",
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain("white-space: normal");
    });
    it("should render table data cells with default minimum column width when width is undefined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain(`min-width: ${DEFAULT_MIN_WIDTH}`);
    });
    it("should render table data cells with defined column width when width is defined", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columns: [
          {
            label: "Name",
            property: "name",
            renderer: "text",
            position: 0,
            width: 789,
          },
        ],
      });

      const firstColumnData = wrapper.findAll("td").at(0);
      expect(firstColumnData?.attributes().style).toContain("min-width: 789px");
    });

    it("should not render table cell when disable context menu action and settings table action", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        disableEdit: true,
        disableDelete: true,
        disableSettingsTable: true,
      });

      expect(wrapper.find(".mt-data-table__table-context-button").exists()).toBeFalsy();
      expect(wrapper.find(".mt-data-table__table-settings-button").exists()).toBeFalsy();
    });
  });

  it("should render table data cells with an image inside", async () => {
    const wrapper = createWrapper();

    await wrapper.setProps({
      ...wrapper.props(),
      columns: [
        {
          label: "Name",
          property: "name",
          previewImage: "imageURL",
          renderer: "text",
          position: 0,
        },
      ],
    });

    const image = wrapper.find("img");
    expect(image.exists()).toBeTruthy();
  });

  describe("should render the card props correctly", () => {
    it("should render the title", () => {
      const wrapper = createWrapper();

      const title = wrapper.find(".mt-card__title");

      expect(title.exists()).toBeTruthy();
      expect(title.text()).toBe("Data table");
    });

    it("should render the subtitle", () => {
      const wrapper = createWrapper();

      const subtitle = wrapper.find(".mt-card__subtitle");

      expect(subtitle.exists()).toBeTruthy();
      expect(subtitle.text()).toBe("This is the subline");
    });

    it("should not render the title", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        title: undefined,
      });

      const title = wrapper.find(".mt-card__title");

      expect(title.exists()).toBeFalsy();
    });

    it("should not render the subtitle", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        subtitle: undefined,
      });

      const subtitle = wrapper.find(".mt-card__subtitle");

      expect(subtitle.exists()).toBeFalsy();
    });
  });

  describe("should render the general props correctly", () => {
    it("should not render the reload button", async () => {
      const wrapper = createWrapper();

      const reloadButton = wrapper.find('.mt-button[aria-label="reload-data"]');

      expect(reloadButton.exists()).toBeFalsy();
    });

    it("should render the reload button", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        enableReload: true,
      });

      const reloadButton = wrapper.find('.mt-button[aria-label="reload-data"]');

      expect(reloadButton.exists()).toBeTruthy();
    });
  });

  describe("should execute the functionalities correctly", () => {
    it("should emit the reload on event on clicking the reload button", async () => {
      const wrapper = createWrapper();
      await wrapper.setProps({
        ...wrapper.props(),
        enableReload: true,
      });

      const reloadButton = wrapper.find('.mt-button[aria-label="reload-data"]');

      expect(wrapper.emitted().reload).toBeFalsy();

      await reloadButton.trigger("click");

      expect(wrapper.emitted().reload).toBeTruthy();
    });
  });

  describe("should have a correct column resizing behaviour", () => {
    it("should render the resizable div", async () => {
      const wrapper = createWrapper();

      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const tableHeadCellManufacturer = wrapper.find(
        '[data-header-column-property="manufacturer.name"]',
      );
      const tableHeadCellPrice = wrapper.find('[data-header-column-property="price"]');

      expect(
        tableHeadCellName.find(".mt-data-table__table-head-resizable-after").exists(),
      ).toBeTruthy();
      expect(
        tableHeadCellManufacturer.find(".mt-data-table__table-head-resizable-after").exists(),
      ).toBeTruthy();
      expect(
        tableHeadCellPrice.find(".mt-data-table__table-head-resizable-after").exists(),
      ).toBeTruthy();
    });

    it("should not render the resizable div when allowedResize is set to false", async () => {
      const wrapper = createWrapper();

      const tableHeadCellActive = wrapper.find('[data-header-column-property="active"]');

      expect(
        tableHeadCellActive.find(".mt-data-table__table-head-resizable-after").exists(),
      ).toBeFalsy();
    });

    it("should make all columns fixed width when start resizing", async () => {
      const wrapper = createWrapper();

      // these columns should have fixed width later
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const tableHeadCellManufacturer = wrapper.find(
        '[data-header-column-property="manufacturer.name"]',
      );

      // this column should not change their width
      const tableHeadCellActive = wrapper.find('[data-header-column-property="active"]');

      // check header columns before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );
      expect(tableHeadCellManufacturer.attributes().style).toContain(
        `width: auto; min-width: ${DEFAULT_MIN_WIDTH}; max-width: fit-content;`,
      );
      expect(tableHeadCellActive.attributes().style).toContain(
        "width: 123px; min-width: 123px; max-width: fit-content;",
      );

      // check data cell columns before resizing
      const dataCellName = wrapper.findAllComponents('[data-cell-column-property="name"]');
      const dataCellManufacturer = wrapper.findAll(
        '[data-cell-column-property="manufacturer.name"]',
      );
      const dataCellActive = wrapper.findAll('[data-cell-column-property="active"]');

      dataCellName.forEach((dataCell) => {
        expect(dataCell.attributes().style).toContain(
          "width: 200px; min-width: 200px; max-width: 200px;",
        );
      });

      dataCellManufacturer.forEach((dataCell) => {
        expect(dataCell.attributes().style).toContain(
          "width: auto; min-width: 100px; max-width: 100px;",
        );
      });

      dataCellActive.forEach((dataCell) => {
        expect(dataCell.attributes().style).toContain(
          "width: 123px; min-width: 123px; max-width: 123px;",
        );
      });

      // TRIGGER RESIZING

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ width: 200 });
      // @ts-expect-error - only needed values are set
      tableHeadCellManufacturer.element.getBoundingClientRect = () => ({ width: 100 });
      // @ts-expect-error - only needed values are set
      tableHeadCellActive.element.getBoundingClientRect = () => ({ width: 123 });

      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");
      resizableDiv.trigger("mousedown");

      // check header columns after resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // should now be fixed width and not auto
      expect(tableHeadCellManufacturer.attributes().style).toContain(
        "width: 100px; min-width: 100px; max-width: fit-content;",
      );
      expect(tableHeadCellActive.attributes().style).toContain(
        "width: 123px; min-width: 123px; max-width: fit-content;",
      );
    });

    it("should set the cursor globally to col-resize when start resizing", async () => {
      const wrapper = createWrapper();

      // check cursor before resizing
      expect(document.body.style.cursor).toBe("");

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // check cursor after resizing
      expect(document.body.style.cursor).toBe("col-resize");
    });

    it("should remove the global col-resize cursor when stopping resizing", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // check cursor after resizing
      expect(document.body.style.cursor).toBe("col-resize");

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check cursor after resizing
      expect(document.body.style.cursor).toBe("");
    });

    it('should add class "--no-transition" to table when resizing', async () => {
      const wrapper = createWrapper();

      // check if class not exists before resizing
      expect(wrapper.find("table").classes()).not.toContain("--no-transition");

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // check class after resizing
      expect(wrapper.find("table").classes()).toContain("--no-transition");
    });

    it('should remove class "--no-transition" to table when finishing resizing', async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // check if class not exists before resizing
      expect(wrapper.find("table").classes()).not.toContain("--no-transition");

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // check class after resizing
      expect(wrapper.find("table").classes()).toContain("--no-transition");

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check class after resizing
      expect(wrapper.find("table").classes()).not.toContain("--no-transition");
    });

    it("should stop and prevent default event behaviour like propagation and preventDefault in mouseMove handler", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      vi.spyOn(mouseMoveEvent, "preventDefault").mockImplementation(() => {});
      vi.spyOn(mouseMoveEvent, "stopPropagation").mockImplementation(() => {});
      await window.dispatchEvent(mouseMoveEvent);

      // check if preventDefault and stopPropagation was called
      expect(mouseMoveEvent.preventDefault).toHaveBeenCalledWith();
      expect(mouseMoveEvent.stopPropagation).toHaveBeenCalledWith();
    });

    it("should set the correct widths for the current column cells when the mouse is moving", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // check if width and height are set correctly
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 155px; min-width: 155px; max-width: fit-content;",
      );
      const dataCellName = wrapper.findAllComponents('[data-cell-column-property="name"]');
      dataCellName.forEach((dataCell) => {
        expect(dataCell.attributes().style).toContain(
          "width: 155px; min-width: 155px; max-width: 155px;",
        );
      });
    });

    it("should add the correct padding for the current column cells when shrinking the column more than at the beginning", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ width: 200, left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // check if padding is set correctly to dataTable
      expect(wrapper.find("table").attributes().style).toContain("padding-right: 45px;");
    });

    it("should add no padding for the current column cells when enlarging the column more than at the beginning", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ width: 200, left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 630;
      await window.dispatchEvent(mouseMoveEvent);

      // check if no padding was set because the column gets enlarged
      expect(wrapper.find("table").attributes().style).toBeUndefined();
    });

    it("should remove the padding when stopping resizing", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ width: 200, left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // check if padding is set correctly to dataTable
      expect(wrapper.find("table").attributes().style).toContain("padding-right: 45px;");

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check if padding was removed correctly
      expect(wrapper.find("table").attributes().style).toBe("");
    });

    it("should save the new width to the property columnChanges", async () => {
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check if columnChanges prop was updated correctly
      expect(wrapper.props().columnChanges).toStrictEqual({ name: { width: 155 } });
    });

    it("should load the new widths from the property columnChanges when they were defined beforehand", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        columnChanges: {
          name: { width: 179 },
        },
      });

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 179px; min-width: 179px; max-width: fit-content;",
      );
    });

    it("should remove all handlers when stopping resizing", async () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const wrapper = createWrapper();

      // get the resizable div
      const tableHeadCellName = wrapper.find('[data-header-column-property="name"]');
      const resizableDiv = tableHeadCellName.find(".mt-data-table__table-head-resizable-after");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.element.getBoundingClientRect = () => ({ left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName.attributes().style).toContain(
        "width: 200px; min-width: 200px; max-width: fit-content;",
      );

      // TRIGGER RESIZING
      await resizableDiv.trigger("mousedown");

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check if all handlers were removed
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
    });
  });

  describe("should have correct search funcitonalitities", () => {
    it("should have a search input field", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".mt-search").exists()).toBeTruthy();
    });

    it("should not render the search input field", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        disableSearch: true,
      });

      expect(wrapper.find(".mt-search").exists()).toBeFalsy();
    });

    it("should use the search value from prop", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        searchValue: "My initital search value",
      });

      const searchInput = wrapper.find(".mt-search input");

      // @ts-expect-error - inputElement has value
      expect(searchInput.element.value).toBe("My initital search value");
    });

    it("should emit the search value", async () => {
      const wrapper = createWrapper();

      const searchInput = wrapper.find(".mt-search input");

      await searchInput.setValue("My new search value");
      await searchInput.trigger("change");

      console.log(wrapper.emitted());

      expect(wrapper.emitted()["search-value-change"]).toBeTruthy();
      // @ts-expect-error - only needed values are set
      expect(wrapper.emitted()["search-value-change"][0][0]).toBe("My new search value");
    });
  });

  describe("should handle the mt-data-table-settings events correctly", () => {
    it("should reset all changes", async () => {
      const wrapper = createWrapper();

      // simulate some column changes
      await wrapper.setProps({
        ...wrapper.props(),
        columnChanges: {
          active: { visible: false },
          available: { width: 987 },
        },
      });

      expect(wrapper.props().columnChanges).toStrictEqual({
        active: { visible: false },
        available: { width: 987 },
      });

      const MtDataTableSettings = wrapper.findComponent({ name: "MtDataTableSettings" });
      await MtDataTableSettings.vm.$emit("reset-all-changes");
      await wrapper.vm.$nextTick();

      // check if all changes were resetted
      expect(wrapper.props().columnChanges).toStrictEqual({
        active: {},
        available: {},
      });
    });

    it("should change the column order", async () => {
      const wrapper = createWrapper();

      expect(wrapper.props().columnChanges).toStrictEqual({});

      const MtDataTableSettings = wrapper.findComponent({ name: "MtDataTableSettings" });
      await MtDataTableSettings.vm.$emit("change-column-order", {
        itemId: "price",
        dropId: "name",
        dropZone: "after",
      });
      await wrapper.vm.$nextTick();

      // check if order was updated correctly
      expect(wrapper.props().columnChanges).toStrictEqual({
        name: { position: 0 },
        price: { position: 100 },
        "manufacturer.name": { position: 200 },
        active: { position: 300 },
        stock: { position: 400 },
        available: { position: 500 },
      });
    });

    it("should change the column visibility", async () => {
      const wrapper = createWrapper();

      expect(wrapper.props().columnChanges).toStrictEqual({});

      const MtDataTableSettings = wrapper.findComponent({ name: "MtDataTableSettings" });
      await MtDataTableSettings.vm.$emit("change-column-visibility", "active", false);
      await wrapper.vm.$nextTick();

      // check if order was updated correctly
      expect(wrapper.props().columnChanges).toStrictEqual({
        active: { visible: false },
      });
    });

    it("should disable settings table", async () => {
      const wrapper = createWrapper();

      await wrapper.setProps({
        ...wrapper.props(),
        disableSettingsTable: true,
      });

      expect(wrapper.find(".mt-data-table-settings").exists()).toBeFalsy();
    });
  });
});
