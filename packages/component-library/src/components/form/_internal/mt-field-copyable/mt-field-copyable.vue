<template>
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <mt-icon
    v-tooltip="{
      message: tooltipText,
      width: 220,
      position: 'top',
      showDelay: 300,
      hideDelay: 0,
    }"
    class="mt-field-copyable"
    name="regular-products-s"
    @click="copyToClipboard"
    @mouseleave="resetTooltipText"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import MtTooltipDirective from "../../../../directives/tooltip.directive";
import MtNotificationMixin from "../../../../mixins/notification.mixin";
import { copyToClipboard as copyToClipboardUtil } from "../../../../utils/dom";

export default defineComponent({
  name: "MtFieldCopyable",

  i18n: {
    messages: {
      en: {
        "mt-field-copyable": {
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
        "mt-field-copyable": {
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
    tooltip: MtTooltipDirective,
  },

  components: {
    "mt-icon": MtIcon,
  },

  mixins: [MtNotificationMixin],

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
        return this.$tc("mt-field-copyable.tooltip.wasCopied");
      }

      return this.$tc("mt-field-copyable.tooltip.canCopy");
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
          title: this.$tc("mt-field-copyable.errorTitle"),
          message: this.$tc("mt-field-copyable.notificationCopyFailureMessage"),
        });
      }
    },

    tooltipSuccess() {
      this.wasCopied = true;
    },

    notificationSuccess() {
      this.createNotificationInfo({
        message: this.$tc("mt-field-copyable.notificationCopySuccessMessage"),
      });
    },

    resetTooltipText() {
      this.wasCopied = false;
    },
  },
});
</script>

<style lang="scss">
.mt-field-copyable {
  &.mt-icon {
    cursor: pointer;
  }
}
</style>
