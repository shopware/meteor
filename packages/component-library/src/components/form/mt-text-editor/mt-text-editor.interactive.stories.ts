import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "../../../_internal/test-helper";

import meta, { type MtTextEditorMeta, type MtTextEditorStory } from "./mt-text-editor.stories";
import { defineStory } from "@/_internal/story-helper";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-text-editor",
} as MtTextEditorMeta;

/**
 * Selects the text of an element. It is important to
 * click on the element before calling this function
 * to ensure that the element is focused. Because
 * Storybook throws manual events, the element is not
 * focused by default.
 */
function selectText(element: HTMLElement) {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

export const VisualTestRenderEditor: MtTextEditorStory = defineStory({
  name: "Should render the text editor",
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("82 characters")).toBeDefined();
  },
});

export const VisualTestRenderEditorInlineMode: MtTextEditorStory = defineStory({
  name: "Should render the text editor in inline mode",
  args: {
    isInlineEdit: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("82 characters")).toBeDefined();
  },
});

export const VisualTestRenderDisabledEditor: MtTextEditorStory = defineStory({
  name: "Should render the disabled text editor",
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("82 characters")).toBeDefined();
  },
});

export const VisualTestRenderPlaceholder: MtTextEditorStory = defineStory({
  name: "Should render the placeholder inside text editor",
  args: {
    placeholder: "Type something...",
    modelValue: "",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("0 characters")).toBeDefined();
  },
});

export const VisualTestRenderError: MtTextEditorStory = defineStory({
  name: "Should render a error in text editor",
  args: {
    error: {
      code: 500,
      detail: "Error while saving!",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("82 characters")).toBeDefined();
  },
});

export const VisualTestRenderEditorInlineModeSelected: MtTextEditorStory = defineStory({
  name: "Should render the bubble menu in inline mode when text is selected",
  args: {
    isInlineEdit: true,
    modelValue: `<table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Hello World</p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><p></p>`,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Wait until the counter is rendered
    await waitUntil(() => canvas.getByText("11 characters"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Wait until the bubble menu is rendered
    await waitUntil(() => document.querySelector(".mt-text-editor-toolbar") !== null);

    // Expect the bubble menu to be rendered
    expect(canvas.getByLabelText("Format")).toBeDefined();
    expect(canvas.getByLabelText("Bold")).toBeDefined();
    expect(canvas.getByLabelText("Italic")).toBeDefined();

    // Expect the contextual buttons to be rendered
    expect(canvas.getByLabelText("Insert row before")).toBeDefined();
    expect(canvas.getByLabelText("Insert row after")).toBeDefined();
    expect(canvas.getByLabelText("Delete row")).toBeDefined();
  },
});

export const SetParagraph: MtTextEditorStory = defineStory({
  name: "Should set paragraph",
  args: {
    modelValue: `<h1>Hello World</h1>`,
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Paragraph"
    await userEvent.click(screen.getByText("Paragraph"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<p>Hello World</p>");
  },
});

export const SetHeadlineH1: MtTextEditorStory = defineStory({
  name: "Should set h1 headline",
  args: {
    modelValue: `<p>Hello World</p>`,
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Headline 1"
    await userEvent.click(screen.getByText("Headline 1"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<h1>Hello World</h1>");
  },
});

export const SetHeadlineH2: MtTextEditorStory = defineStory({
  name: "Should set h2 headline",
  args: {
    modelValue: "<p>Hello World</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Headline 2"
    await userEvent.click(screen.getByText("Headline 2"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<h2>Hello World</h2>");
  },
});

export const SetHeadlineH3: MtTextEditorStory = defineStory({
  name: "Should set h3 headline",
  args: {
    modelValue: "<p>Hello World</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Headline 3"
    await userEvent.click(screen.getByText("Headline 3"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<h3>Hello World</h3>");
  },
});

export const SetHeadlineH4: MtTextEditorStory = defineStory({
  name: "Should set h4 headline",
  args: {
    modelValue: "<p>Hello World</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Headline 4"
    await userEvent.click(screen.getByText("Headline 4"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<h4>Hello World</h4>");
  },
});

export const SetHeadlineH5: MtTextEditorStory = defineStory({
  name: "Should set h5 headline",
  args: {
    modelValue: "<p>Hello World</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Headline 5"
    await userEvent.click(screen.getByText("Headline 5"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<h5>Hello World</h5>");
  },
});

export const SetHeadlineH6: MtTextEditorStory = defineStory({
  name: "Should set h6 headline",
  args: {
    modelValue: "<p>Hello World</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("11 characters")).toBeDefined();

    // Click on button with aria-label "Format"
    await userEvent.click(canvas.getByLabelText("Format"));

    // Click on menuitem with text "Headline 6"
    await userEvent.click(screen.getByText("Headline 6"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue.mock.calls.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith("<h6>Hello World</h6>");
  },
});

export const SetTextColor: MtTextEditorStory = defineStory({
  name: "Should set text color",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "colorpicker-toggle"
    await userEvent.click(canvas.getByLabelText("colorpicker-toggle"));

    // Set new color value
    await waitUntil(() => document.querySelector("[aria-label='colorpicker-apply-color']"));

    const redInput = screen.getByLabelText("red-value") as HTMLInputElement;
    const greenInput = screen.getByLabelText("green-value") as HTMLInputElement;
    const blueInput = screen.getByLabelText("blue-value") as HTMLInputElement;

    await userEvent.clear(redInput);
    await userEvent.type(redInput, "255");

    await userEvent.clear(greenInput);
    await userEvent.type(greenInput, "0");

    await userEvent.clear(blueInput);
    await userEvent.type(blueInput, "0");

    // Click on button with aria-label "Apply"
    await userEvent.click(screen.getByLabelText("colorpicker-apply-color"));

    // Expect the color to be applied
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<h1><span style="color: #ff0000">Hello World</span></h1><p>Some text</p>',
    );
  },
});

export const MakeFontBold: MtTextEditorStory = defineStory({
  name: "Should make font bold",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "bold"
    await userEvent.click(canvas.getByLabelText("Bold"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<h1><strong>Hello World</strong></h1><p>Some text</p>",
    );
  },
});

export const MakeFontItalic: MtTextEditorStory = defineStory({
  name: "Should make font italic",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "italic"
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<h1><em>Hello World</em></h1><p>Some text</p>",
    );
  },
});

export const MakeFontUnderline: MtTextEditorStory = defineStory({
  name: "Should make font underline",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "underline"
    await userEvent.click(canvas.getByLabelText("Underline"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<h1><u>Hello World</u></h1><p>Some text</p>",
    );
  },
});

export const MakeFontStrikeThrough: MtTextEditorStory = defineStory({
  name: "Should make font strike through",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "strike-through"
    await userEvent.click(canvas.getByLabelText("Strikethrough"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<h1><s>Hello World</s></h1><p>Some text</p>",
    );
  },
});

export const MakeFontSuperScript: MtTextEditorStory = defineStory({
  name: "Should make font super script",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "superscript"
    await userEvent.click(canvas.getByLabelText("Superscript"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<h1><sup>Hello World</sup></h1><p>Some text</p>",
    );
  },
});

export const MakeFontSubScript: MtTextEditorStory = defineStory({
  name: "Should make font sub script",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "subscript"
    await userEvent.click(canvas.getByLabelText("Subscript"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<h1><sub>Hello World</sub></h1><p>Some text</p>",
    );
  },
});

export const SetTextAlignmentLeft: MtTextEditorStory = defineStory({
  name: "Should set text alignment left",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Text Alignment"
    await userEvent.click(canvas.getByLabelText("Text Alignment"));

    // Click on menuitem with text "Align left"
    await userEvent.click(screen.getByText("Align left"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content (no change expected because left is default)
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<h1 style="text-align: left">Hello World</h1><p>Some text</p>',
    );
  },
});

export const SetTextAlignmentCenter: MtTextEditorStory = defineStory({
  name: "Should set text alignment center",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Text Alignment"
    await userEvent.click(canvas.getByLabelText("Text Alignment"));

    // Click on menuitem with text "Align center"
    await userEvent.click(screen.getByText("Align center"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<h1 style="text-align: center">Hello World</h1><p>Some text</p>',
    );
  },
});

export const SetTextAlignmentRight: MtTextEditorStory = defineStory({
  name: "Should set text alignment right",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("20 characters")).toBeDefined();

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Text Alignment"
    await userEvent.click(canvas.getByLabelText("Text Alignment"));

    // Click on menuitem with text "Align right"
    await userEvent.click(screen.getByText("Align right"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<h1 style="text-align: right">Hello World</h1><p>Some text</p>',
    );
  },
});

export const SetTextAlignmentJustify: MtTextEditorStory = defineStory({
  name: "Should set text alignment justify",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args, screen }) => {
    const canvas = within(canvasElement);

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Text Alignment"
    await userEvent.click(canvas.getByLabelText("Text Alignment"));

    // Click on menuitem with text "Align justify"
    await userEvent.click(screen.getByText("Justify"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<h1 style="text-align: justify">Hello World</h1><p>Some text</p>',
    );
  },
});

export const SetUnorderedList: MtTextEditorStory = defineStory({
  name: "Should set unordered list",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Unordered list"
    await userEvent.click(canvas.getByLabelText("Insert Unordered List"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<ul><li><p>Hello World</p></li></ul><p>Some text</p>",
    );
  },
});

export const SetOrderedList: MtTextEditorStory = defineStory({
  name: "Should set ordered list",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Ordered list"
    await userEvent.click(canvas.getByLabelText("Insert Ordered List"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      "<ol><li><p>Hello World</p></li></ol><p>Some text</p>",
    );
  },
});

export const SetLink: MtTextEditorStory = defineStory({
  name: "Should set link",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click inside the editor
    await userEvent.click(canvas.getByText("Hello World"));

    // Select "Hello World" text
    selectText(canvas.getByText("Hello World"));

    // Click on button with aria-label "Link"
    await userEvent.click(canvas.getByLabelText("Link"));

    // Get body
    const body = within(document.body);

    // Set link url
    const linkInput = body.getByLabelText("Link URL");
    await userEvent.clear(linkInput);
    await userEvent.type(linkInput, "https://www.shopware.com");

    // Toggle link target
    const targetCheckbox = document.querySelector(
      "div[aria-label='Open in new tab'] input[type='checkbox'",
    ) as HTMLInputElement;
    await userEvent.click(targetCheckbox);

    // Click on button with text "Apply link"
    await userEvent.click(body.getByText("Apply link"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<h1><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.shopware.com">Hello World</a></h1><p>Some text</p>',
    );
  },
});

export const InsertTable: MtTextEditorStory = defineStory({
  name: "Should insert table",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on button with aria-label "Table"
    await userEvent.click(canvas.getByLabelText("Table"));

    // Get body
    const body = within(document.body);

    // Set table columns
    const columnsInput = body.getByLabelText("Columns");
    await userEvent.type(columnsInput, "{selectall}{backspace}4");

    // Set table rows
    const rowsInput = body.getByLabelText("Rows");
    await userEvent.type(rowsInput, "{selectall}{backspace}2");

    // Click on button with text "Insert table"
    await userEvent.click(body.getByText("Insert table"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check if args was triggered with new content
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<table style="min-width: 100px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th><th colspan="1" rowspan="1"><p></p></th></tr><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1"><p></p></td></tr></tbody></table><h1>Hello World</h1><p>Some text</p>',
    );
  },
});

export const VisualTestShowContextualButtons: MtTextEditorStory = defineStory({
  name: "Should show contextual buttons when inside a table",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on button with aria-label "Table"
    await userEvent.click(canvas.getByLabelText("Table"));

    // Get body
    const body = within(document.body);

    // Wait until modal transition is finished
    await waitUntil(() => document.body.querySelector("div[role='dialog']"));
    await waitUntil(() => !document.body.querySelector(".modal-enter-active"));

    // Set table columns
    const columnsInput = body.getByLabelText("Columns");
    await userEvent.type(columnsInput, "{selectall}{backspace}4");

    // Set table rows
    const rowsInput = body.getByLabelText("Rows");
    await userEvent.type(rowsInput, "{selectall}{backspace}2");

    // Click on button with text "Insert table"
    await userEvent.click(body.getByText("Insert table"));

    // Wait until modal is closed
    await waitUntil(() => !document.body.querySelector("div[role='dialog']"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Click inside a table cell
    const tableCell = document.querySelector(
      ".mt-text-editor__content-editor table td",
    ) as HTMLElement;
    await userEvent.click(tableCell);

    // Expect the contextual buttons to be rendered
    expect(canvas.getByLabelText("Insert row before")).toBeDefined();
    expect(canvas.getByLabelText("Insert row after")).toBeDefined();
    expect(canvas.getByLabelText("Delete row")).toBeDefined();
    expect(canvas.getByLabelText("Insert column before")).toBeDefined();
    expect(canvas.getByLabelText("Insert column after")).toBeDefined();
    expect(canvas.getByLabelText("Delete column")).toBeDefined();
    expect(canvas.getByLabelText("Remove table")).toBeDefined();
  },
});

export const VisualTestRenderCodeView: MtTextEditorStory = defineStory({
  name: "Should render the code view",
  args: {
    modelValue: "<h1>Hello World</h1><p>Some text</p>",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click on button with aria-label "Toggle code"
    await userEvent.click(canvas.getByLabelText("Toggle code"));

    // Expect the code view to be rendered
    const codeEditor = canvas.getByRole("textbox");
    expect(codeEditor).toBeDefined();
    expect(codeEditor.innerText).toBe("<h1>Hello World</h1><p>Some text</p>");
  },
});
