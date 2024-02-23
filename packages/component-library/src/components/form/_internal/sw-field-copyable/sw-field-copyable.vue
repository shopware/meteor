<template>
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <sw-icon
    v-tooltip="{
      message: tooltipText,
      width: 220,
      position: 'top',
      showDelay: 300,
      hideDelay: 0,
    }"
    class="sw-field-copyable"
    name="regular-products-s"
    @click="copyToClipboard"
    @mouseleave="resetTooltipText"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SwIcon from "../../../icons-media/sw-icon/sw-icon.vue";
import SwTooltipDirective from "../../../../directives/tooltip.directive";
import SwNotificationMixin from "../../../../mixins/notification.mixin";
import { copyToClipboard as copyToClipboardUtil } from "../../../../utils/dom";

export default defineComponent({
  name: "SwFieldCopyable",

  i18n: {
    messages: {
      en: {
        "sw-field-copyable": {
          tooltip: {
            wasCopied: "Copied to clipboard.",
            canCopy: "Copy to clipboard.",
            notificationCopySuccessMessage: "Text has been copied to clipboard.",
            notificationCopyFailureMessage: "Text could not be copied to clipboard.",
            errorTitle: "Error copying to clipboard",
          },
        },
      },
      de: {
        "sw-field-copyable": {
          tooltip: {
            wasCopied: "In Zwischenablage kopiert.",
            canCopy: "In Zwischenablage kopieren.",
            notificationCopySuccessMessage: "Der Text wurde in die Zwischenablage kopiert.",
            notificationCopyFailureMessage:
              "Der Text konnte nicht in die Zwischenablage kopiert werden.",
            errorTitle: "Fehler beim kopieren in die Zwischenablage",
          },
        },
      },
    },
  },

  directives: {
    tooltip: SwTooltipDirective,
  },

  components: {
    "sw-icon": SwIcon,
  },

  mixins: [SwNotificationMixin],

  props: {
    copyableText: {
      type: String,
      required: false,
      default: null,
    },

    tooltip: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      wasCopied: false,
    };
  },

  computed: {
    tooltipText(): string {
      if (this.wasCopied) {
        return this.$tc("sw-field-copyable.tooltip.wasCopied");
      }

      return this.$tc("sw-field-copyable.tooltip.canCopy");
    },
  },

  methods: {
    copyToClipboard() {
      if (!this.copyableText) {
        return;
      }

      try {
        copyToClipboardUtil(this.copyableText);
        if (this.tooltip) {
          this.tooltipSuccess();
        } else {
          this.notificationSuccess();
        }
      } catch (err) {
        this.createNotificationError({
          title: this.$tc("sw-field-copyable.errorTitle"),
          message: this.$tc("sw-field-copyable.notificationCopyFailureMessage"),
        });
      }
    },

    tooltipSuccess() {
      this.wasCopied = true;
    },

    notificationSuccess() {
      this.createNotificationInfo({
        message: this.$tc("sw-field-copyable.notificationCopySuccessMessage"),
      });
    },

    resetTooltipText() {
      this.wasCopied = false;
    },
  },
});
</script>

<style lang="scss">
.sw-field-copyable {
  &.sw-icon {
    cursor: pointer;
  }
}
</style>
