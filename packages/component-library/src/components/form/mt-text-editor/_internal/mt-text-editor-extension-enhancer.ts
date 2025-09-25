import type { Extension } from "@tiptap/core";

/**
 * Enhances TipTap extensions to preserve custom HTML attributes like class and style
 */
export function enhanceExtensionsWithAttributes(extensions: Extension[]): Extension[] {
  return extensions.map((extension) => {
    // Get the extension's name to avoid conflicts
    const extensionName = extension.name;

    // Skip extensions that don't render HTML elements or already handle these attributes
    const skipExtensions = [
      "text",
      "doc",
      "characterCount",
      "placeholder",
      "bubbleMenu",
      "floatingMenu",
      // Skip list item since our CustomListItem handles its own attributes
      "listItem",
    ];

    if (skipExtensions.includes(extensionName)) {
      return extension;
    }

    try {
      // Extend the extension to add class and style attributes
      return extension.extend({
        addAttributes() {
          const parentAttributes = this.parent?.() || {};

          return {
            ...parentAttributes,
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
    } catch (error) {
      // If extending fails for any reason, return the original extension
      console.warn(`Failed to enhance extension ${extensionName} with attributes:`, error);
      return extension;
    }
  });
}

/**
 * Additional attributes that should be preserved on HTML elements
 */
export const PRESERVED_ATTRIBUTES = {
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
  "data-*": {
    default: null,
    parseHTML: (element: Element) => {
      const dataAttrs: Record<string, string> = {};
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name.startsWith("data-")) {
          dataAttrs[attr.name] = attr.value;
        }
      });
      return Object.keys(dataAttrs).length > 0 ? dataAttrs : null;
    },
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes["data-*"]) {
        return {};
      }
      return attributes["data-*"];
    },
  },
};

export default enhanceExtensionsWithAttributes;
