<template>
  <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
  <button type="button">
    <mt-icon
      v-tooltip="{
        message: tooltipText,
        width: 220,
        position: 'top',
        showDelay: 300,
        hideDelay: 0,
      }"
      class="mt-field-copyable"
      name="regular-copy"
      size="18"
      @click="copyToClipboard"
      @mouseleave="wasCopied = false"
    />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import MtIcon from "../../../icons-media/mt-icon/mt-icon.vue";
import MtTooltipDirective from "../../../../directives/tooltip.directive";
import MtNotificationMixin from "../../../../mixins/notification.mixin";
import { copyToClipboard as copyToClipboardUtil } from "../../../../utils/dom";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MtFieldCopyable",

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

  setup(props) {
    const wasCopied = ref(false);

    const { t } = useI18n({
      messages: {
        en: {
          tooltip: {
            wasCopied: "Copied to clipboard.",
            canCopy: "Copy to clipboard.",
            notificationCopySuccessMessage: "Text has been copied to clipboard.",
            notificationCopyFailureMessage: "Text could not be copied to clipboard.",
            errorTitle: "Error copying to clipboard",
          },
        },
        de: {
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
    });

    const tooltipText = computed(() =>
      wasCopied.value ? t("tooltip.wasCopied") : t("tooltip.canCopy"),
    );

    function copyToClipboard() {
      if (!props.copyableText) return;
      copyToClipboardUtil(props.copyableText);

      if (props.tooltip) {
        wasCopied.value = true;
      }
    }

    return {
      copyToClipboard,
      tooltipText,
      wasCopied,
    };
  },
});
</script>

<style scoped>
.mt-field-copyable {
  cursor: pointer;
}
</style>
