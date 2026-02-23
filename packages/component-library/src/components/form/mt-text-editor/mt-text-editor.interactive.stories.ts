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

function getCharacterCount(canvasElement: HTMLElement) {
  const counter = within(canvasElement).queryByText(/characters$/);
  const match = counter?.textContent?.match(/(\d+) characters/);
  if (!match) return null;
  return Number.parseInt(match[1], 10);
}

async function expectCharacterCount(canvasElement: HTMLElement, expected: number) {
  await waitUntil(() => getCharacterCount(canvasElement) === expected);
  expect(getCharacterCount(canvasElement)).toBe(expected);
}

async function waitForCharacterCounter(canvasElement: HTMLElement) {
  await waitUntil(() => getCharacterCount(canvasElement) !== null);
}

export const VisualTestRenderEditor: MtTextEditorStory = defineStory({
  name: "Should render the text editor",
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForCharacterCounter(canvasElement);
  },
});

export const VisualTestRenderEditorInlineMode: MtTextEditorStory = defineStory({
  name: "Should render the text editor in inline mode",
  args: {
    isInlineEdit: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForCharacterCounter(canvasElement);
  },
});

export const VisualTestRenderDisabledEditor: MtTextEditorStory = defineStory({
  name: "Should render the disabled text editor",
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitForCharacterCounter(canvasElement);
  },
});

export const VisualTestRenderPlaceholder: MtTextEditorStory = defineStory({
  name: "Should render the placeholder inside text editor",
  args: {
    placeholder: "Type something...",
    modelValue: "<p></p>",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expectCharacterCount(canvasElement, 0);
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

    await waitForCharacterCounter(canvasElement);
  },
});

export const VisualTestCharacterCountWysiwyg: MtTextEditorStory = defineStory({
  name: "Should update the character count in WYSIWYG mode",
  args: {
    modelValue: "<p></p>",
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector(
      ".mt-text-editor__content-editor",
    ) as HTMLElement | null;

    expect(editor).toBeDefined();

    await userEvent.click(editor!);
    await userEvent.type(editor!, "Hello");

    await expectCharacterCount(canvasElement, 5);
  },
});

export const VisualTestCharacterCountCodeMode: MtTextEditorStory = defineStory({
  name: "Should update the character count in code mode",
  args: {
    codeMode: true,
    modelValue: "",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const codeEditor = canvas.getByRole("textbox");

    await userEvent.click(codeEditor);
    await userEvent.type(codeEditor, "abc");

    await expectCharacterCount(canvasElement, 3);
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
    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    await waitForCharacterCounter(canvasElement);

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

    // Wait for character counter
    await waitForCharacterCounter(canvasElement);

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

    // Wait for character counter
    await waitForCharacterCounter(canvasElement);

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

    // Wait for character counter
    await waitForCharacterCounter(canvasElement);

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

    // Click on button with aria-label "Switch to code mode"
    await userEvent.click(canvas.getByLabelText("Switch to code mode"));

    // Expect the code view to be rendered
    const codeEditor = canvas.getByRole("textbox");
    expect(codeEditor).toBeDefined();
    expect(codeEditor.innerText).toBe("<h1>Hello World</h1><p>Some text</p>");
  },
});

/**
 * Tests to check that the given HTML content is rendered correctly
 * in the text editor. And that custom HTML tags are not removed.
 *
 * These tests address issues mentioned in:
 * - https://github.com/shopware/shopware/discussions/11570
 * - https://github.com/shopware/shopware/issues/11216
 *
 * The tests verify that when formatting text in the editor,
 * the HTML structure, CSS classes, inline styles, and semantic
 * elements are preserved and not modified by the editor.
 */

export const PreserveBasicHTMLStructure: MtTextEditorStory = defineStory({
  name: "Should preserve basic HTML structure when formatting text",
  args: {
    modelValue:
      '<p>This is a <span class="highlight">highlighted</span> text.</p><p>Another paragraph.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on the text
    await userEvent.click(canvas.getByText("Another paragraph."));

    // Select the text
    selectText(canvas.getByText("Another paragraph."));

    // Make it bold
    await userEvent.click(canvas.getByLabelText("Bold"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that the span with class is preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];
    expect(expectedHtml).toEqual(
      '<p>This is a <span class="highlight">highlighted</span> text.</p><p><strong>Another paragraph.</strong></p>',
    );
  },
});

export const PreserveImageTags: MtTextEditorStory = defineStory({
  name: "Should not remove img tags when formatting text",
  args: {
    modelValue:
      '<p>Here is an image:</p><img src="https://placehold.co/200x50" alt="Test image" class="responsive-img" style="max-width: 100%;"> <p>and some text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await waitUntil(() => canvas.queryByText("Here is an image:"));
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on text using a more flexible matcher
    const textElement = canvas.getByText((content, _element) => {
      return content.includes("and some text");
    });
    await userEvent.click(textElement);

    // Select the text element
    selectText(textElement);

    // Make it bold
    await userEvent.click(canvas.getByLabelText("Bold"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that img tag is preserved with all attributes
    const result = args.updateModelValue.mock.calls[0][0];
    const expectedHtml =
      '<p>Here is an image:</p><img src="https://placehold.co/200x50" alt="Test image" class="responsive-img" style="max-width: 100%;"><p><strong>and some text.</strong></p>';

    expect(result).toEqual(expectedHtml);
  },
});

export const PreserveLinkAttributesInternal: MtTextEditorStory = defineStory({
  name: "Should not add target and rel attributes to internal links",
  args: {
    modelValue:
      '<p>Visit our <a target="_self" href="/internal-page">internal page</a> for more info.</p><p>Some additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click inside the editor
    await userEvent.click(canvas.getByText("Some additional text."));

    // Select the additional text
    selectText(canvas.getByText("Some additional text."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that link attributes are preserved and no unwanted attributes are added
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<p>Visit our <a target="_self" href="/internal-page">internal page</a> for more info.</p><p><em>Some additional text.</em></p>',
    );
  },
});

export const PreserveLinkAttributesUnknown: MtTextEditorStory = defineStory({
  name: "Should not add target and rel attributes to unknown links",
  args: {
    modelValue:
      '<p>Visit our <a href="/normal-link">normal link</a> for more info.</p><p>Some additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click inside the editor
    await userEvent.click(canvas.getByText("Some additional text."));

    // Select the additional text
    selectText(canvas.getByText("Some additional text."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that link attributes are preserved and no unwanted attributes are added
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<p>Visit our <a href="/normal-link">normal link</a> for more info.</p><p><em>Some additional text.</em></p>',
    );
  },
});

export const PreserveLinkAttributesExternal: MtTextEditorStory = defineStory({
  name: "Should not add target and rel attributes to external links",
  args: {
    modelValue:
      '<p>Visit our <a target="_blank" href="/external-link">external link</a> for more info.</p><p>Some additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click inside the editor
    await userEvent.click(canvas.getByText("Some additional text."));

    // Select the additional text
    selectText(canvas.getByText("Some additional text."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that link attributes are preserved and no unwanted attributes are added
    expect(args.updateModelValue).toHaveBeenCalledWith(
      '<p>Visit our <a target="_blank" href="/external-link">external link</a> for more info.</p><p><em>Some additional text.</em></p>',
    );
  },
});

export const PreserveSpanTags: MtTextEditorStory = defineStory({
  name: "Should not remove or modify span tags",
  args: {
    modelValue:
      '<p>This is <span class="highlight" style="background-color: yellow;">highlighted text</span> in a paragraph.</p><p>Another paragraph.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on "Another paragraph." text
    await userEvent.click(canvas.getByText("Another paragraph."));

    // Select "Another paragraph." text
    selectText(canvas.getByText("Another paragraph."));

    // Make it bold
    await userEvent.click(canvas.getByLabelText("Bold"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that span tag with its attributes is preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];

    expect(expectedHtml).toEqual(
      '<p>This is <span class="highlight" style="background-color: yellow;">highlighted text</span> in a paragraph.</p><p><strong>Another paragraph.</strong></p>',
    );
  },
});

export const PreserveDivTags: MtTextEditorStory = defineStory({
  name: "Should not remove or modify div tags",
  args: {
    modelValue:
      '<div class="container" style="max-width: 900px; margin: 0 auto;" id="foo"> <h2>Title</h2> <p>Content goes here.</p> </div> <p>Additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on "Additional text." text
    await userEvent.click(canvas.getByText("Additional text."));

    // Select "Additional text." text
    selectText(canvas.getByText("Additional text."));

    // Make it bold
    await userEvent.click(canvas.getByLabelText("Bold"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that div tag with its attributes is preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];
    expect(expectedHtml).toEqual(
      '<div class="container" style="max-width: 900px; margin: 0 auto;" id="foo"><h2>Title</h2><p>Content goes here.</p></div><p><strong>Additional text.</strong></p>',
    );
  },
});

export const PreserveSemanticElements: MtTextEditorStory = defineStory({
  name: "Should not remove semantic elements like header, footer, nav",
  args: {
    modelValue:
      '<header class="page-header"><nav class="main-nav"><ul><li><p>Home</p></li><li><p>About</p></li></ul></nav></header><main><p>Main content here.</p></main><footer class="page-footer"><p>Footer content.</p></footer><p>Some additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on "Some additional text." text
    await userEvent.click(canvas.getByText("Some additional text."));

    // Select "Some additional text." text
    selectText(canvas.getByText("Some additional text."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that semantic elements are preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];
    expect(expectedHtml).toEqual(
      '<header class="page-header"><nav class="main-nav"><ul><li><p>Home</p></li><li><p>About</p></li></ul></nav></header><main><p>Main content here.</p></main><footer class="page-footer"><p>Footer content.</p></footer><p><em>Some additional text.</em></p>',
    );
  },
});

export const PreserveFigureAndFigcaption: MtTextEditorStory = defineStory({
  name: "Should not remove figure and figcaption tags",
  args: {
    modelValue:
      '<figure class="image-figure" style="text-align: center;"><img src="/chart.png" alt="Sales Chart"><figcaption>Sales data for Q1 2024</figcaption></figure><p>Analysis below.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on "Analysis below." text
    await userEvent.click(canvas.getByText("Analysis below."));

    // Select "Analysis below." text
    selectText(canvas.getByText("Analysis below."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that figure and figcaption tags are preserved without automatic p tags
    const expectedHtml = args.updateModelValue.mock.calls[0][0];
    expect(expectedHtml).toEqual(
      '<figure class="image-figure" style="text-align: center;"><img src="/chart.png" alt="Sales Chart"><figcaption>Sales data for Q1 2024</figcaption></figure><p><em>Analysis below.</em></p>',
    );
  },
});

export const PreserveCSSStylesInTables: MtTextEditorStory = defineStory({
  name: "Should not remove CSS styles from tables",
  args: {
    modelValue:
      '<table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 50px"> <colgroup> <col style="min-width: 25px"> <col style="min-width: 25px"> </colgroup> <tbody> <tr style="background-color: #f5f5f5;"> <th colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"> <p>Name</p> </th> <th colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"> <p>Value</p> </th> </tr> <tr> <td colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"> <p>Item 1</p> </td> <td colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"> <p>100</p> </td> </tr> </tbody> </table> <p>Some additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on "Some additional text." text
    await userEvent.click(canvas.getByText("Some additional text."));

    // Select "Some additional text." text
    selectText(canvas.getByText("Some additional text."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that table CSS styles are preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];
    expect(expectedHtml).toEqual(
      '<table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 50px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr style="background-color: #f5f5f5;"><th colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"><p>Name</p></th><th colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"><p>Value</p></th></tr><tr><td colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"><p>Item 1</p></td><td colspan="1" rowspan="1" style="padding: 10px; border: 1px solid #ccc;"><p>100</p></td></tr></tbody></table><p><em>Some additional text.</em></p>',
    );
  },
});

export const PreserveCSSClasses: MtTextEditorStory = defineStory({
  name: "Should not remove CSS classes from elements",
  args: {
    modelValue:
      '<div class="content-wrapper custom-layout"><h2 class="section-title primary-color">Section Title</h2><p class="text-content large-text">This is important content.</p></div>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on the text content
    await userEvent.click(canvas.getByText("This is important content."));

    // Select the text content
    selectText(canvas.getByText("This is important content."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that CSS classes are preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];

    // Verify the structure and classes are preserved
    expect(expectedHtml).toEqual(
      '<div class="content-wrapper custom-layout"><h2 class="section-title primary-color">Section Title</h2><p class="text-content large-text"><em>This is important content.</em></p></div>',
    );
  },
});

export const PreserveComplexHTMLStructure: MtTextEditorStory = defineStory({
  name: "Should preserve complex HTML structure when formatting text",
  args: {
    modelValue:
      '<div style="max-width: 900px; margin: 0 auto;"> <h2 style="text-align: center; margin-bottom: 2rem" class="display-5">Placeholder Headline Text</h2> </div> <div style="max-width: 900px; margin: 0 auto;"> <p style="text-align: center; font-size: 1rem">Placeholder paragraph text with a <a target="_self" href="/sample-link">sample link</a> and more placeholder text to demonstrate formatting effects.</p> </div> <p>Some additional text.</p>',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for the editor to be ready and then wait 200ms for any potential transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Click on "Some additional text." text
    await userEvent.click(canvas.getByText("Some additional text."));

    // Select "Some additional text." text
    selectText(canvas.getByText("Some additional text."));

    // Make it italic
    await userEvent.click(canvas.getByLabelText("Italic"));

    // Wait until args was triggered with new content
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Check that the complex HTML structure is preserved
    const expectedHtml = args.updateModelValue.mock.calls[0][0];
    expect(expectedHtml).toEqual(
      '<div style="max-width: 900px; margin: 0 auto;"><h2 style="text-align: center; margin-bottom: 2rem" class="display-5">Placeholder Headline Text</h2></div><div style="max-width: 900px; margin: 0 auto;"><p style="text-align: center; font-size: 1rem">Placeholder paragraph text with a <a target="_self" href="/sample-link">sample link</a> and more placeholder text to demonstrate formatting effects.</p></div><p><em>Some additional text.</em></p>',
    );
  },
});

// ------------------------------
// Gate & Diff modal scenarios
// ------------------------------

export const VisualTestGateOnInitialUnsupportedHTML: MtTextEditorStory = defineStory({
  name: "Should show gate overlay for unsupported HTML on mount",
  args: {
    modelValue: '<div class="box" data-custom="123"><p>Content</p></div>',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait until the gate overlay is rendered
    await waitUntil(() => !!document.querySelector(".mt-text-editor__gate"));

    // Assert gate actions are visible
    expect(canvas.getByText("View code")).toBeDefined();
  },
});

export const AcceptUnsupportedHtmlDiff_AppliesParsedCode: MtTextEditorStory = defineStory({
  name: "Should accept diff and apply parsed HTML when switching back",
  args: {
    modelValue: "<p>Hello</p>",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Go to code view
    await userEvent.click(canvas.getByLabelText("Switch to code mode"));

    // Replace code with unsupported HTML (data-custom)
    const codeEditor = canvas.getByRole("textbox") as HTMLElement;
    await userEvent.click(codeEditor);
    await userEvent.type(
      codeEditor,
      '{selectall}{backspace}<div class="box" data-custom="123"><p>Content</p></div>',
    );

    // Switch back to WYSIWYG (triggers diff modal)
    await userEvent.click(canvas.getByLabelText("Switch to visual mode"));

    // Wait for diff modal
    await waitUntil(() => document.body.querySelector("div[role='dialog']"));
    const body = within(document.body);
    expect(body.getByText("Code changes required")).toBeDefined();

    // Accept changes
    await userEvent.click(body.getByText("Apply changes"));
    await waitUntil(() => args.updateModelValue?.mock?.calls?.length > 0);

    // Open code view again
    await userEvent.click(canvas.getByLabelText("Switch to code mode"));

    const updatedEditor = canvas.getByRole("textbox") as HTMLElement;

    await waitUntil(() => !updatedEditor.innerText.includes("data-custom"));

    // Assert unsupported attribute removed, structure retained
    expect(updatedEditor.innerText).not.toContain("data-custom");
    expect(updatedEditor.innerText).toContain('<div class="box"');
    expect(updatedEditor.innerText).toContain("<p>Content</p>");
  },
});

export const CancelUnsupportedHtmlDiff_StaysInCode: MtTextEditorStory = defineStory({
  name: "Should cancel diff and remain in code view with original code",
  args: {
    modelValue: "<p>Hello</p>",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Go to code view
    await userEvent.click(canvas.getByLabelText("Switch to code mode"));

    // Replace code with unsupported HTML (data-custom)
    const codeEditor = canvas.getByRole("textbox") as HTMLElement;
    await userEvent.click(codeEditor);
    await userEvent.type(
      codeEditor,
      '{selectall}{backspace}<div class="box" data-custom="123"><p>Content</p></div>',
    );

    // Switch back to WYSIWYG (triggers diff modal)
    await userEvent.click(canvas.getByLabelText("Switch to visual mode"));

    // Wait for diff modal
    await waitUntil(() => document.body.querySelector("div[role='dialog']"));
    const body = within(document.body);
    expect(body.getByText("Code changes required")).toBeDefined();

    // Cancel: stay in code editor
    await userEvent.click(body.getByText("Continue in code mode"));

    // Wait until modal is closed
    await waitUntil(() => !document.body.querySelector("div[role='dialog']"));

    // Ensure we are in code editor and the original unsupported code remains
    const stillCodeEditor = canvas.getByRole("textbox") as HTMLElement;
    expect(stillCodeEditor).toBeDefined();
    expect(stillCodeEditor.innerText).toContain("data-custom");
  },
});

export const VisualTestDiffModalShownAfterEditingUnsupportedHTML: MtTextEditorStory = defineStory({
  name: "Should show diff modal after editing unsupported HTML in code",
  args: {
    modelValue: "<p>Hello</p>",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Go to code view
    await userEvent.click(canvas.getByLabelText("Switch to code mode"));

    // Replace code with unsupported HTML (data-custom)
    const codeEditor = canvas.getByRole("textbox") as HTMLElement;
    await userEvent.click(codeEditor);
    await userEvent.type(
      codeEditor,
      '{selectall}{backspace}<div class="box" data-custom="123"><p>Content</p></div>',
    );

    // Switch back to WYSIWYG (triggers diff modal)
    await userEvent.click(canvas.getByLabelText("Switch to visual mode"));

    // Wait for diff modal and assert basic elements
    await waitUntil(() => document.body.querySelector("div[role='dialog']"));
    const body = within(document.body);
    expect(body.getByText("Code changes required")).toBeDefined();
    expect(body.getByText("Continue in code mode")).toBeDefined();
    expect(body.getByText("Apply changes")).toBeDefined();
  },
});

// ------------------------------
// showToolbar prop tests
// ------------------------------

export const VisualTestHiddenToolbar: MtTextEditorStory = defineStory({
  name: "Should not render toolbar when showToolbar is false",
  args: {
    modelValue: "<p>Editor without toolbar</p>",
    showToolbar: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for editor to render
    await waitUntil(() => canvas.queryByText("Editor without toolbar"));

    // Assert toolbar is not present
    const toolbar = canvasElement.querySelector(".mt-text-editor-toolbar");
    expect(toolbar).toBeNull();

    // Assert editor content is still rendered
    expect(canvas.getByText("Editor without toolbar")).toBeDefined();
  },
});

export const TestShowToolbar: MtTextEditorStory = defineStory({
  name: "Should render toolbar when showToolbar is true (default)",
  args: {
    modelValue: "<p>Editor with toolbar</p>",
    showToolbar: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for editor to render
    await waitUntil(() => canvas.queryByText("Editor with toolbar"));

    // Assert toolbar buttons are present
    expect(canvas.getByLabelText("Format")).toBeDefined();
    expect(canvas.getByLabelText("Bold")).toBeDefined();
    expect(canvas.getByLabelText("Italic")).toBeDefined();
  },
});

// ------------------------------
// codeMode prop tests
// ------------------------------

export const TestCodeModeDefault: MtTextEditorStory = defineStory({
  name: "Should start in code mode when codeMode is true",
  args: {
    modelValue: "<p>Hello World</p>",
    codeMode: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for code editor to be rendered
    await waitUntil(() => canvas.queryByRole("textbox"));

    // Expect the code editor to be rendered
    const codeEditor = canvas.getByRole("textbox");
    expect(codeEditor).toBeDefined();
    expect(codeEditor.innerText).toBe("<p>Hello World</p>");

    // Expect the toggle button to show "Switch to visual mode"
    expect(canvas.getByLabelText("Switch to visual mode")).toBeDefined();
  },
});

export const TestCodeModeFalse: MtTextEditorStory = defineStory({
  name: "Should start in WYSIWYG mode when codeMode is false (default)",
  args: {
    modelValue: "<p>Hello World</p>",
    codeMode: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for WYSIWYG editor to be rendered
    await waitUntil(() => canvas.queryByText("Hello World"));

    // Expect the WYSIWYG content to be rendered
    expect(canvas.getByText("Hello World")).toBeDefined();

    // Expect the toggle button to show "Switch to code mode"
    expect(canvas.getByLabelText("Switch to code mode")).toBeDefined();
  },
});
