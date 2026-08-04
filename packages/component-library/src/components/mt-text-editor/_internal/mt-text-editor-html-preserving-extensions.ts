import { Node } from "@tiptap/core";

/**
 * Extension to preserve generic HTML container elements like span, div, etc.
 * These elements are often used for styling and semantic purposes and should be preserved.
 */
export const GenericContainer = Node.create({
  name: "genericContainer",
  group: "inline",
  content: "inline*",
  inline: true,

  addAttributes() {
    return {
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
      id: {
        default: null,
        parseHTML: (element: Element) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (node) => {
          // Only handle spans that have class, style, or id attributes
          // Let TextStyle handle spans with just style for color/formatting
          const element = node as Element;
          const hasClass = element.hasAttribute("class");
          const hasId = element.hasAttribute("id");

          // If it only has style attribute (likely for color), let TextStyle handle it
          if (!hasClass && !hasId && element.hasAttribute("style")) {
            return false;
          }

          return hasClass || hasId ? {} : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

/**
 * Extension to preserve div elements with their attributes
 */
export const DivContainer = Node.create({
  name: "divContainer",
  group: "block",
  content: "block+",

  addAttributes() {
    return {
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
      id: {
        default: null,
        parseHTML: (element: Element) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

/**
 * Extension to preserve semantic HTML elements
 */
export const SemanticElements = Node.create({
  name: "semanticElements",
  group: "block",
  content: "block+",

  addAttributes() {
    return {
      tagName: {
        default: "div",
        parseHTML: (element: Element) => element.tagName.toLowerCase(),
        renderHTML: () => {
          // tagName is not rendered as an HTML attribute, it's used in renderHTML method
          return {};
        },
      },
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
      id: {
        default: null,
        parseHTML: (element: Element) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      { tag: "header" },
      { tag: "footer" },
      { tag: "nav" },
      { tag: "main" },
      { tag: "article" },
      { tag: "section" },
      { tag: "aside" },
      { tag: "figure" },
      // figcaption is handled by a separate extension to allow inline content
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    // Use the stored tagName from attributes to preserve the original semantic element
    const tagName = node.attrs.tagName || "div";
    return [tagName, HTMLAttributes, 0];
  },
});

/**
 * Extension specifically for figcaption that allows inline content without wrapping in p tags
 */
export const FigcaptionElement = Node.create({
  name: "figcaption",
  group: "block",
  content: "inline*", // Allow inline content without forcing block elements

  addAttributes() {
    return {
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
      id: {
        default: null,
        parseHTML: (element: Element) => element.getAttribute("id"),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.id) {
            return {};
          }
          return {
            id: attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "figcaption" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["figcaption", HTMLAttributes, 0];
  },
});

export default { GenericContainer, DivContainer, SemanticElements, FigcaptionElement };
