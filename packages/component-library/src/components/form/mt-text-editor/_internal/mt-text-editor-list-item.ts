import ListItem from "@tiptap/extension-list-item";

/**
 * Custom ListItem extension that prevents wrapping content in <p> tags
 * and preserves class and style attributes
 *
 * Based on the solution from: https://discuss.prosemirror.net/t/removing-the-default-paragraph-p-inside-a-list-item-li/2745/14
 * This addresses the issue where TipTap/ProseMirror automatically wraps list item content in paragraph tags.
 *
 * The key change is setting `content: 'text*'` instead of the default `content: 'paragraph block*'`
 * which tells ProseMirror that list items should contain only text nodes, not block elements.
 */
const CustomListItem = ListItem.extend({
  content: "text*",

  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element: Element) => element.getAttribute("class"),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
      style: {
        default: null,
        parseHTML: (element: Element) => element.getAttribute("style"),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});

export default CustomListItem;
