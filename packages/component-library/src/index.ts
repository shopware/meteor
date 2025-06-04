import MtDatepicker from "./components/form/mt-datepicker/mt-datepicker.vue";
import MtBanner from "./components/feedback-indicator/mt-banner/mt-banner.vue";
import MtLoader from "./components/feedback-indicator/mt-loader/mt-loader.vue";
import MtProgressBar from "./components/feedback-indicator/mt-progress-bar/mt-progress-bar.vue";
import MtButton from "./components/form/mt-button/mt-button.vue";
import MtCheckbox from "./components/form/mt-checkbox/mt-checkbox.vue";
import MtColorpicker from "./components/form/mt-colorpicker/mt-colorpicker.vue";
import MtEmailField from "./components/form/mt-email-field/mt-email-field.vue";
import MtLink from "./components/navigation/mt-link/mt-link.vue";
import MtNumberField from "./components/form/mt-number-field/mt-number-field.vue";
import MtPasswordField from "./components/form/mt-password-field/mt-password-field.vue";
import MtSelect from "./components/form/mt-select/mt-select.vue";
import MtSlider from "@/components/form/mt-slider/mt-slider.vue";
import MtSwitch from "./components/form/mt-switch/mt-switch.vue";
import MtTextField from "./components/form/mt-text-field/mt-text-field.vue";
import MtTextarea from "./components/form/mt-textarea/mt-textarea.vue";
import MtIcon from "./components/icons-media/mt-icon/mt-icon.vue";
import MtCard from "./components/layout/mt-card/mt-card.vue";
import MtEmptyState from "./components/layout/mt-empty-state/mt-empty-state.vue";
import MtTabs from "./components/navigation/mt-tabs/mt-tabs.vue";
import MtDataTable from "./components/table-and-list/mt-data-table/mt-data-table.vue";
import MtPagination from "./components/table-and-list/mt-pagination/mt-pagination.vue";
import MtSkeletonBar from "./components/feedback-indicator/mt-skeleton-bar/mt-skeleton-bar.vue";
import MtToast, { type Toast } from "./components/feedback-indicator/mt-toast/mt-toast.vue";
import MtPopover from "./components/overlay/mt-popover/mt-popover.vue";
import MtPopoverItem from "./components/overlay/mt-popover-item/mt-popover-item.vue";
import MtPopoverItemResult from "./components/overlay/mt-popover-item-result/mt-popover-item-result.vue";
import MtFloatingUi from "./components/_internal/mt-floating-ui/mt-floating-ui.vue";
import MtModal from "./components/overlay/mt-modal/mt-modal.vue";
import MtModalRoot from "./components/overlay/mt-modal/sub-components/mt-modal-root.vue";
import MtModalClose from "./components/overlay/mt-modal/sub-components/mt-modal-close.vue";
import MtModalTrigger from "./components/overlay/mt-modal/sub-components/mt-modal-trigger.vue";
import MtModalAction from "./components/overlay/mt-modal/sub-components/mt-modal-action.vue";
import MtText from "./components/content/mt-text/mt-text.vue";
import MtInset from "./components/layout/mt-inset/mt-inset.vue";
import MtThemeProvider from "./components/theme/mt-theme-provider.vue";
import TooltipDirective from "./directives/tooltip.directive";
import DeviceHelperPlugin from "./plugin/device-helper.plugin";
import MtTooltip from "./components/overlay/mt-tooltip/mt-tooltip.vue";
import MtTextEditor from "./components/form/mt-text-editor/mt-text-editor.vue";
import MtTextEditorToolbarButton from "./components/form/mt-text-editor/_internal/mt-text-editor-toolbar-button.vue";
import MtSearch from "./components/navigation/mt-search/mt-search.vue";
import MtUrlField from "./components/form/mt-url-field/mt-url-field.vue";
import MtUnitField from "./components/form/mt-unit-field/mt-unit-field.vue";
import MtEntityDataTable from "./components/entity/mt-entity-data-table/mt-entity-data-table.vue";

// Import SCSS for styling
import "./components/assets/scss/all.scss";

// Importing types
import type {
  Filter,
  Option,
} from "./components/table-and-list/mt-data-table/mt-data-table.interfaces";

export {
  MtBanner,
  MtLoader,
  MtProgressBar,
  MtButton,
  MtCheckbox,
  MtColorpicker,
  MtDatepicker,
  MtEmailField,
  MtLink,
  MtNumberField,
  MtPasswordField,
  MtSelect,
  MtSlider,
  MtSwitch,
  MtTextField,
  MtTextarea,
  MtTextEditor,
  MtTextEditorToolbarButton,
  MtIcon,
  MtCard,
  MtEmptyState,
  MtTabs,
  MtDataTable,
  MtPagination,
  MtSkeletonBar,
  MtToast,
  MtPopover,
  MtPopoverItem,
  MtPopoverItemResult,
  MtTooltip,
  MtFloatingUi,
  MtModal,
  MtModalRoot,
  MtModalTrigger,
  MtModalClose,
  MtModalAction,
  MtText,
  MtInset,
  MtSearch,
  MtUrlField,
  MtThemeProvider,
  MtUnitField,
  MtEntityDataTable,
  TooltipDirective,
  DeviceHelperPlugin,
  // @deprecated
  MtBanner as SwBanner,
  // @deprecated
  MtLoader as SwLoader,
  // @deprecated
  MtProgressBar as SwProgressBar,
  // @deprecated
  MtButton as SwButton,
  // @deprecated
  MtCheckbox as SwCheckbox,
  // @deprecated
  MtColorpicker as SwColorpicker,
  // @deprecated
  MtDatepicker as SwDatepicker,
  // @deprecated
  MtEmailField as SwEmailField,
  // @deprecated
  MtNumberField as SwNumberField,
  // @deprecated
  MtPasswordField as SwPasswordField,
  // @deprecated
  MtSelect as SwSelect,
  // @deprecated
  MtSwitch as SwSwitch,
  // @deprecated
  MtTextField as SwTextField,
  // @deprecated
  MtTextarea as SwTextarea,
  // @deprecated
  MtIcon as SwIcon,
  // @deprecated
  MtCard as SwCard,
  // @deprecated
  MtTabs as SwTabs,
  // @deprecated
  MtDataTable as SwDataTable,
  // @deprecated
  MtPagination as SwPagination,
  // @deprecated
  MtSkeletonBar as SwSkeletonBar,
};

// Exporting types
export type { Filter, Option, Toast };
