import { render, screen, waitFor, within, type RenderOptions } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { reactive } from "vue";
import MtDataTable, { type ColumnChanges, type ColumnDefinition } from "./mt-data-table.vue";
import MtDataTableFixtures from "./mt-data-table.fixtures.json";
import flushPromises from "flush-promises";
import { get } from "@/utils/object";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useI18n } from "vue-i18n";

// Mock "useDebounceFn" from "@vueuse/core"
vi.mock("@vueuse/core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@vueuse/core")>()),
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

type MtDataTableProps = NonNullable<RenderOptions<typeof MtDataTable>["props"]>;

function renderDataTable(
  options: { props?: Partial<MtDataTableProps>; slots?: Record<string, string> } = {},
) {
  return render(MtDataTable, {
    props: {
      dataSource: MtDataTableFixtures,
      columns: columnsFixture,
      title: "Data table",
      subtitle: "This is the subline",
      currentPage: 1,
      paginationTotalItems: 182,
      paginationLimit: 25,
      ...options.props,
    },
    slots: options.slots,
    global: {
      mocks: {
        $t: (v: string) => v,
      },
      stubs: {
        "mt-icon": true,
        teleport: true,
      },
    },
  });
}

function getColumnHeader(property: string) {
  return screen.getByTestId(`column-table-head__${property}`);
}

function getResizeHandle(property: string) {
  return screen.getByTestId(`mt-data-table__table-head-resizable-after__${property}`);
}

function getColumnCells(property: string) {
  const columnIndex = screen.getAllByRole("columnheader").indexOf(getColumnHeader(property));
  const [, ...dataRows] = screen.getAllByRole("row");

  return dataRows.map((row) => within(row).getAllByRole("cell")[columnIndex]);
}

async function openTableSettings() {
  await userEvent.click(screen.getByRole("button", { name: "aria-toggle-table-settings" }));
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
    renderDataTable();

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  describe("should throw an console error if columns aren't correctly defined", () => {
    it("missing label", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
          columns: [
            // @ts-expect-error - validator check
            {
              property: "name",
              renderer: "text",
              position: 0,
              width: 200,
            },
          ],
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("missing property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
          columns: [
            // @ts-expect-error - validator check
            {
              label: "name",
              renderer: "text",
              position: 0,
              width: 200,
            },
          ],
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("missing renderer", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
          columns: [
            // @ts-expect-error - validator check
            {
              label: "name",
              property: "name",
              position: 0,
              width: 200,
            },
          ],
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("missing position", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
          columns: [
            // @ts-expect-error - validator check
            {
              label: "name",
              property: "name",
              renderer: "text",
              width: 200,
            },
          ],
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong label property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
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
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong property property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
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
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong renderer property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
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
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });

    it("wrong position property", async () => {
      // spy for console.error calls
      vi.spyOn(console, "warn").mockImplementation(() => {});

      renderDataTable({
        props: {
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
        },
      });

      // @ts-expect-error - mock was set from jest
      expect(console.warn.mock.calls[0][0]).toContain(
        `Invalid prop: custom validator check failed for prop "columns"`,
      );
    });
  });

  describe("should render the table header cells correctly", () => {
    it("should render table header cells everytime with 'fit-content' in the 'max-width' property", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
              width: 200,
            },
          ],
        },
      });

      const firstColumnHeader = screen.getAllByRole("columnheader")[0];
      expect(firstColumnHeader).toHaveAttribute(
        "style",
        expect.stringContaining("max-width: fit-content"),
      );
    });
    it("should render table header cells with default minimum column width and auto main width when given width is undefined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
            },
          ],
        },
      });

      const firstColumnHeader = screen.getAllByRole("columnheader")[0];
      expect(firstColumnHeader).toHaveAttribute(
        "style",
        expect.stringContaining(`min-width: ${DEFAULT_MIN_WIDTH}`),
      );
      expect(firstColumnHeader).toHaveAttribute("style", expect.stringContaining("width: auto"));
    });
    it("should render table header cells with defined column width when width is defined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
              width: 789,
            },
          ],
        },
      });

      const firstColumnHeader = screen.getAllByRole("columnheader")[0];
      expect(firstColumnHeader).toHaveAttribute(
        "style",
        expect.stringContaining("min-width: 789px"),
      );
      expect(firstColumnHeader).toHaveAttribute("style", expect.stringContaining("width: 789px"));
    });
  });

  describe("should render the table data cells correctly", () => {
    it("should render table data cells with 'max-width' to 'auto' when 'cellWrap' is 'normal'", async () => {
      renderDataTable({
        props: {
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
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute("style", expect.stringContaining("max-width: auto"));
    });
    it("should render table data cells with 'max-width' to 'XXXpx' when 'cellWrap' is 'nowrap' and 'width' is defined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
              width: 789,
            },
          ],
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute("style", expect.stringContaining("max-width: 789px"));
    });
    it("should render table data cells with 'max-width' to fallback width when 'cellWrap' is 'nowrap' and 'width' is undefined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
            },
          ],
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute(
        "style",
        expect.stringContaining(`max-width: ${DEFAULT_MIN_WIDTH}`),
      );
    });
    it("should render table data cells with nowrap white-space when cellWrap is undefined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
            },
          ],
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute(
        "style",
        expect.stringContaining("white-space: nowrap"),
      );
    });
    it("should render table data cells with 'normal' white-space when cellWrap is 'normal'", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
              cellWrap: "normal",
            },
          ],
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute(
        "style",
        expect.stringContaining("white-space: normal"),
      );
    });
    it("should render table data cells with default minimum column width when width is undefined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
            },
          ],
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute(
        "style",
        expect.stringContaining(`min-width: ${DEFAULT_MIN_WIDTH}`),
      );
    });
    it("should render table data cells with defined column width when width is defined", async () => {
      renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
              width: 789,
            },
          ],
        },
      });

      const firstColumnData = screen.getAllByRole("cell")[0];
      expect(firstColumnData).toHaveAttribute("style", expect.stringContaining("min-width: 789px"));
    });

    it("should not render table cell when disable context menu action and settings table action", async () => {
      renderDataTable({
        props: {
          disableEdit: true,
          disableDelete: true,
          disableSettingsTable: true,
        },
      });

      expect(screen.getAllByRole("columnheader")).toHaveLength(columnsFixture.length);
      expect(screen.getAllByRole("cell")).toHaveLength(
        columnsFixture.length * MtDataTableFixtures.length,
      );
    });

    it("should render table cell when using slot column", async () => {
      renderDataTable({
        slots: {
          "column-name": "My custom name",
        },
      });

      const firstDataRow = screen.getAllByRole("row")[1];
      const dataCellName = within(firstDataRow).getAllByRole("cell")[0];

      expect(dataCellName).toHaveTextContent("My custom name");
    });

    it("should render table data with disabled row selection", async () => {
      renderDataTable({
        props: {
          allowRowSelection: true,
          disableRowSelect: ["4f683593-13f1-4767-91c6-8e154d68a22d"], // product id of "Awesome Concrete Chair"
        },
      });

      const disabledRow = screen.getByRole("row", { name: /Awesome Concrete Chair/ });
      const allowedRow = screen.getByRole("row", { name: /Fantastic Cotton Sausages/ });

      expect(within(disabledRow).getByRole("checkbox")).toBeDisabled();
      expect(within(allowedRow).getByRole("checkbox")).toBeEnabled();
    });
  });

  it("should render table data cells with an image inside", async () => {
    renderDataTable({
      props: {
        columns: [
          {
            label: "Name",
            property: "name",
            previewImage: "imageURL",
            renderer: "text",
            position: 0,
          },
        ],
      },
    });

    expect(screen.getByRole("img", { name: MtDataTableFixtures[0].name })).toBeInTheDocument();
  });

  describe("should render the card props correctly", () => {
    it("should render the title", () => {
      renderDataTable();

      expect(screen.getByRole("heading", { name: "Data table" })).toBeInTheDocument();
    });

    it("should render the subtitle", () => {
      renderDataTable();

      expect(screen.getByText("This is the subline")).toBeInTheDocument();
    });

    it("should not render the title", async () => {
      renderDataTable({ props: { title: undefined } });

      expect(screen.queryByRole("heading", { name: "Data table" })).not.toBeInTheDocument();
    });

    it("should not render the subtitle", async () => {
      renderDataTable({ props: { subtitle: undefined } });

      expect(screen.queryByText("This is the subline")).not.toBeInTheDocument();
    });
  });

  describe("should render the general props correctly", () => {
    it("should not render the reload button", async () => {
      renderDataTable();

      expect(screen.queryByRole("button", { name: "reload-data" })).not.toBeInTheDocument();
    });

    it("should render the reload button", async () => {
      renderDataTable({ props: { enableReload: true } });

      expect(screen.getByRole("button", { name: "reload-data" })).toBeInTheDocument();
    });
  });

  describe("should execute the functionalities correctly", () => {
    it("should emit the reload on event on clicking the reload button", async () => {
      const { emitted } = renderDataTable({ props: { enableReload: true } });

      expect(emitted()).not.toHaveProperty("reload");

      await userEvent.click(screen.getByRole("button", { name: "reload-data" }));

      expect(emitted("reload")).toHaveLength(1);
    });

    it("should emit open-details once for a clickable text cell and not for a plain text cell", async () => {
      const [firstRowData] = MtDataTableFixtures;
      const { emitted } = renderDataTable({
        props: {
          columns: [
            {
              label: "Name",
              property: "name",
              renderer: "text",
              position: 0,
              clickable: true,
            },
            {
              label: "Manufacturer",
              property: "manufacturer.name",
              renderer: "text",
              position: 100,
            },
          ],
        },
      });

      const firstDataRow = screen.getAllByRole("row")[1];

      await userEvent.click(within(firstDataRow).getByText(firstRowData.manufacturer.name));

      expect(emitted()).not.toHaveProperty("open-details");

      await userEvent.click(within(firstDataRow).getByRole("link", { name: firstRowData.name }));

      expect(emitted("open-details")).toEqual([[firstRowData]]);
    });
  });

  describe("should have a correct column resizing behaviour", () => {
    it("should render the resizable div", async () => {
      renderDataTable();

      expect(
        within(getColumnHeader("name")).getByTestId(
          "mt-data-table__table-head-resizable-after__name",
        ),
      ).toBeInTheDocument();
      expect(
        within(getColumnHeader("manufacturer.name")).getByTestId(
          "mt-data-table__table-head-resizable-after__manufacturer.name",
        ),
      ).toBeInTheDocument();
      expect(
        within(getColumnHeader("price")).getByTestId(
          "mt-data-table__table-head-resizable-after__price",
        ),
      ).toBeInTheDocument();
    });

    it("should not render the resizable div when allowedResize is set to false", async () => {
      renderDataTable();

      expect(
        within(getColumnHeader("active")).queryByTestId(
          "mt-data-table__table-head-resizable-after__active",
        ),
      ).not.toBeInTheDocument();
    });

    it("should make all columns fixed width when start resizing", async () => {
      renderDataTable();

      // these columns should have fixed width later
      const tableHeadCellName = getColumnHeader("name");
      const tableHeadCellManufacturer = getColumnHeader("manufacturer.name");

      // this column should not change their width
      const tableHeadCellActive = getColumnHeader("active");

      // check header columns before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );
      expect(tableHeadCellManufacturer).toHaveAttribute(
        "style",
        expect.stringContaining(
          `width: auto; min-width: ${DEFAULT_MIN_WIDTH}; max-width: fit-content;`,
        ),
      );
      expect(tableHeadCellActive).toHaveAttribute(
        "style",
        expect.stringContaining("width: 123px; min-width: 123px; max-width: fit-content;"),
      );

      // check data cell columns before resizing
      getColumnCells("name").forEach((dataCell) => {
        expect(dataCell).toHaveAttribute(
          "style",
          expect.stringContaining("width: 200px; min-width: 200px; max-width: 200px;"),
        );
      });

      getColumnCells("manufacturer.name").forEach((dataCell) => {
        expect(dataCell).toHaveAttribute(
          "style",
          expect.stringContaining("width: auto; min-width: 100px; max-width: 100px;"),
        );
      });

      getColumnCells("active").forEach((dataCell) => {
        expect(dataCell).toHaveAttribute(
          "style",
          expect.stringContaining("width: 123px; min-width: 123px; max-width: 123px;"),
        );
      });

      // TRIGGER RESIZING

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ width: 200 });
      // @ts-expect-error - only needed values are set
      tableHeadCellManufacturer.getBoundingClientRect = () => ({ width: 100 });
      // @ts-expect-error - only needed values are set
      tableHeadCellActive.getBoundingClientRect = () => ({ width: 123 });

      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // check header columns after resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // should now be fixed width and not auto
      expect(tableHeadCellManufacturer).toHaveAttribute(
        "style",
        expect.stringContaining("width: 100px; min-width: 100px; max-width: fit-content;"),
      );
      expect(tableHeadCellActive).toHaveAttribute(
        "style",
        expect.stringContaining("width: 123px; min-width: 123px; max-width: fit-content;"),
      );
    });

    it("should set the cursor globally to col-resize when start resizing", async () => {
      renderDataTable();

      // check cursor before resizing
      expect(document.body.style.cursor).toBe("");

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // check cursor after resizing
      expect(document.body.style.cursor).toBe("col-resize");
    });

    it("should remove the global col-resize cursor when stopping resizing", async () => {
      renderDataTable();

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // check cursor after resizing
      expect(document.body.style.cursor).toBe("col-resize");

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check cursor after resizing
      expect(document.body.style.cursor).toBe("");
    });

    it('should add class "--no-transition" to table when resizing', async () => {
      renderDataTable();

      // check if class not exists before resizing
      expect(screen.getByRole("table")).not.toHaveClass("--no-transition");

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // check class after resizing
      expect(screen.getByRole("table")).toHaveClass("--no-transition");
    });

    it('should remove class "--no-transition" to table when finishing resizing', async () => {
      renderDataTable();

      // check if class not exists before resizing
      expect(screen.getByRole("table")).not.toHaveClass("--no-transition");

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // check class after resizing
      expect(screen.getByRole("table")).toHaveClass("--no-transition");

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check class after resizing
      expect(screen.getByRole("table")).not.toHaveClass("--no-transition");
    });

    it("should stop and prevent default event behaviour like propagation and preventDefault in mouseMove handler", async () => {
      renderDataTable();

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

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
      renderDataTable();

      const tableHeadCellName = getColumnHeader("name");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // check if width and height are set correctly
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 155px; min-width: 155px; max-width: fit-content;"),
      );
      getColumnCells("name").forEach((dataCell) => {
        expect(dataCell).toHaveAttribute(
          "style",
          expect.stringContaining("width: 155px; min-width: 155px; max-width: 155px;"),
        );
      });
    });

    it("should add the correct padding for the current column cells when shrinking the column more than at the beginning", async () => {
      renderDataTable();

      const tableHeadCellName = getColumnHeader("name");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ width: 200, left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // check if padding is set correctly to dataTable
      expect(screen.getByRole("table")).toHaveAttribute(
        "style",
        expect.stringContaining("padding-right: 45px;"),
      );
    });

    it("should add no padding for the current column cells when enlarging the column more than at the beginning", async () => {
      renderDataTable();

      const tableHeadCellName = getColumnHeader("name");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ width: 200, left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 630;
      await window.dispatchEvent(mouseMoveEvent);

      // check if no padding was set because the column gets enlarged
      expect(screen.getByRole("table")).not.toHaveAttribute("style");
    });

    it("should remove the padding when stopping resizing", async () => {
      renderDataTable();

      const tableHeadCellName = getColumnHeader("name");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ width: 200, left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // check if padding is set correctly to dataTable
      expect(screen.getByRole("table")).toHaveAttribute(
        "style",
        expect.stringContaining("padding-right: 45px;"),
      );

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check if padding was removed correctly
      expect(screen.getByRole("table")).toHaveAttribute("style", "");
    });

    it("should save the new width to the property columnChanges", async () => {
      const columnChanges = reactive<Record<string, ColumnChanges>>({});
      renderDataTable({ props: { columnChanges } });

      const tableHeadCellName = getColumnHeader("name");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

      // TRIGGER MOUSE MOVE EVENT
      const mouseMoveEvent = new Event("mousemove");
      // @ts-expect-error - only needed values are set
      mouseMoveEvent.pageX = 230;
      await window.dispatchEvent(mouseMoveEvent);

      // TRIGGER STOP RESIZING
      await window.dispatchEvent(new Event("mouseup"));

      // check if columnChanges prop was updated correctly
      expect(columnChanges).toStrictEqual({ name: { width: 155 } });
    });

    it("should load the new widths from the property columnChanges when they were defined beforehand", async () => {
      renderDataTable({
        props: {
          columnChanges: {
            name: { width: 179 },
          },
        },
      });

      // check if width and height are set before resizing
      expect(getColumnHeader("name")).toHaveAttribute(
        "style",
        expect.stringContaining("width: 179px; min-width: 179px; max-width: fit-content;"),
      );
    });

    it("should remove all handlers when stopping resizing", async () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      renderDataTable();

      const tableHeadCellName = getColumnHeader("name");

      // @ts-expect-error - only needed values are set
      tableHeadCellName.getBoundingClientRect = () => ({ left: 75 });

      // check if width and height are set before resizing
      expect(tableHeadCellName).toHaveAttribute(
        "style",
        expect.stringContaining("width: 200px; min-width: 200px; max-width: fit-content;"),
      );

      // TRIGGER RESIZING
      await userEvent.pointer({ keys: "[MouseLeft>]", target: getResizeHandle("name") });

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
      renderDataTable();

      expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("should not render the search input field", async () => {
      renderDataTable({ props: { disableSearch: true } });

      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    });

    it("should use the search value from prop", async () => {
      renderDataTable({ props: { searchValue: "My initital search value" } });

      expect(screen.getByRole("searchbox")).toHaveValue("My initital search value");
    });

    it("should emit the search value", async () => {
      const { emitted } = renderDataTable();

      await userEvent.type(screen.getByRole("searchbox"), "My new search value");

      expect(emitted("search-value-change").at(-1)).toEqual(["My new search value"]);
    });
  });

  describe("should handle the mt-data-table-settings events correctly", () => {
    it("should reset all changes", async () => {
      // simulate some column changes
      const columnChanges = reactive<Record<string, ColumnChanges>>({
        active: { visible: false },
        available: { width: 987 },
      });
      renderDataTable({ props: { columnChanges } });

      expect(screen.queryByTestId("column-table-head__active")).not.toBeInTheDocument();

      await openTableSettings();
      await userEvent.click(screen.getByRole("menuitem", { name: "resetAllChanges" }));

      // check if all changes were resetted
      expect(columnChanges).toStrictEqual({
        active: {},
        available: {},
      });
      expect(getColumnHeader("active")).toBeInTheDocument();
    });

    it("should change the column order", async () => {
      const columnChanges = reactive<Record<string, ColumnChanges>>({});
      renderDataTable({ props: { columnChanges } });
      const user = userEvent.setup();

      await openTableSettings();
      await user.click(screen.getByRole("menuitem", { name: "columnOrder.title" }));

      const dropBeforeManufacturer = screen
        .getByLabelText("columnOrder.columnGroups.labelShown: Manufacturer")
        .querySelector(".mt-popover-item-result__option_drop_before");

      await user.pointer({
        keys: "[MouseLeft>]",
        target: screen.getByRole("menuitem", { name: "Price" }),
      });
      await waitFor(() => {
        expect(document.body).toHaveClass("is-popover-item-result-dragging");
      });
      await user.pointer({ target: dropBeforeManufacturer! });
      await user.pointer({ keys: "[/MouseLeft]" });

      // check if order was updated correctly
      expect(columnChanges).toStrictEqual({
        name: { position: 0 },
        price: { position: 100, visible: true },
        "manufacturer.name": { position: 200 },
        active: { position: 300 },
        stock: { position: 400 },
        available: { position: 500 },
      });
    });

    it("should change the column visibility", async () => {
      const columnChanges = reactive<Record<string, ColumnChanges>>({});
      renderDataTable({ props: { columnChanges } });

      await openTableSettings();
      await userEvent.click(screen.getByRole("menuitem", { name: "columnOrder.title" }));

      const visibilityToggleActive = screen
        .getByLabelText("columnOrder.columnGroups.labelShown: Active")
        .querySelector(".mt-popover-item__visibility");

      await userEvent.click(visibilityToggleActive!);

      // check if order was updated correctly
      expect(columnChanges).toStrictEqual({
        active: { visible: false },
      });
    });

    it("should disable settings table", async () => {
      renderDataTable({ props: { disableSettingsTable: true } });

      expect(
        screen.queryByRole("button", { name: "aria-toggle-table-settings" }),
      ).not.toBeInTheDocument();
    });

    it("should not disable settings table when there is an additonal context menu", async () => {
      const { emitted } = renderDataTable({
        props: {
          disableSettingsTable: true,
          disableDelete: true,
          disableEdit: true,
          additionalContextButtons: [
            {
              label: "Set Price",
              key: "set-price",
            },
          ],
        },
      });

      const contextButton = screen.getAllByRole("button", { name: "Context menu" })[0];
      expect(contextButton).toBeInTheDocument();
      await userEvent.click(contextButton);
      await userEvent.click(screen.getByRole("menuitem", { name: "Set Price" }));
      expect(emitted("context-select")).toEqual([
        [{ key: "set-price", data: MtDataTableFixtures[0] }],
      ]);
    });
  });
});
