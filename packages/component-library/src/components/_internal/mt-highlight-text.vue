<script lang="ts">
import type { VNode } from "vue";
import { h } from "vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MtHighlightText",

  props: {
    searchTerm: {
      type: String,
      required: false,
      default: null,
    },
    text: {
      type: String,
      required: false,
      default: null,
    },
  },

  methods: {
    searchAndReplace(): string {
      if (!this.text) {
        return "";
      }

      if (!this.searchTerm) {
        return this.text;
      }

      const prefix = '<span class="mt-highlight-text__highlight">';
      const suffix = "</span>";

      const regExp = new RegExp(this.escapeRegExp(this.searchTerm), "ig");
      return this.text.replace(regExp, (str) => `${prefix}${str}${suffix}`);
    },

    // Remove regex special characters from search string
    escapeRegExp(string: string): string {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    },
  },

  render(): VNode {
    return h("div", {
      class: "mt-highlight-text",
      innerHTML: this.searchAndReplace(),
    });
  },
});
</script>

<style>
.mt-highlight-text__highlight {
  color: var(--color-text-brand-default);
  font-weight: var(--font-weight-bold);
}
</style>
