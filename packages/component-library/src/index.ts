import MtDatepicker from "./components/mt-datepicker/mt-datepicker.vue";
import MtBanner from "./components/mt-banner/mt-banner.vue";
import MtBadge from "./components/mt-badge/mt-badge.vue";
import MtLoader from "./components/mt-loader/mt-loader.vue";
import MtProgressBar from "./components/mt-progress-bar/mt-progress-bar.vue";
import MtButton from "./components/mt-button/mt-button.vue";
import MtChart, { type ChartOptions } from "./components/mt-chart/mt-chart.vue";
import MtCheckbox from "./components/mt-checkbox/mt-checkbox.vue";
import MtRadioGroupRoot from "./components/mt-radio-group/mt-radio-group-root.vue";
import MtRadioGroupIndicator from "./components/mt-radio-group/mt-radio-group-indicator.vue";
import MtRadioGroupList from "./components/mt-radio-group/mt-radio-group-list.vue";
import MtRadioGroupItem from "./components/mt-radio-group/mt-radio-group-item.vue";
import MtRadioGroupCustomItem from "./components/mt-radio-group/mt-radio-group-custom-item.vue";
import MtColorpicker from "./components/mt-colorpicker/mt-colorpicker.vue";
import MtDivider from "./components/mt-divider/mt-divider.vue";
import MtEmailField from "./components/mt-email-field/mt-email-field.vue";
import MtHelpText from "./components/mt-help-text/mt-help-text.vue";
import MtLink from "./components/mt-link/mt-link.vue";
import MtNumberField from "./components/mt-number-field/mt-number-field.vue";
import MtPasswordField from "./components/mt-password-field/mt-password-field.vue";
import MtSelect from "./components/mt-select/mt-select.vue";
import MtSlider from "@/components/mt-slider/mt-slider.vue";
import MtSwitch from "./components/mt-switch/mt-switch.vue";
import MtTextField from "./components/mt-text-field/mt-text-field.vue";
import MtTextarea from "./components/mt-textarea/mt-textarea.vue";
import MtIcon from "./components/mt-icon/mt-icon.vue";
import MtCard from "./components/mt-card/mt-card.vue";
import MtEmptyState from "./components/mt-empty-state/mt-empty-state.vue";
import MtTabs from "./components/mt-tabs/mt-tabs.vue";
import MtDataTable from "./components/mt-data-table/mt-data-table.vue";
import MtPagination from "./components/mt-pagination/mt-pagination.vue";
import MtSkeletonBar from "./components/mt-skeleton-bar/mt-skeleton-bar.vue";
import MtToast, { type Toast } from "./components/mt-toast/mt-toast.vue";
import MtSnackbar from "./components/mt-snackbar/mt-snackbar.vue";
import MtAvatar from "./components/mt-avatar/mt-avatar.vue";
import { useSnackbar, type Snackbar } from "./components/mt-snackbar/composables/use-snackbar";
import MtPromoBadge from "./components/mt-promo-badge/mt-promo-badge.vue";
import MtStatusDot from "./components/mt-status-dot/mt-status-dot.vue";
import MtPopover from "./components/mt-popover/mt-popover.vue";
import MtPopoverItem from "./components/mt-popover-item/mt-popover-item.vue";
import MtPopoverItemResult from "./components/mt-popover-item-result/mt-popover-item-result.vue";
import MtFloatingUi from "./components/mt-floating-ui/mt-floating-ui.vue";
import MtModal from "./components/mt-modal/mt-modal.vue";
import MtModalRoot from "./components/mt-modal/sub-components/mt-modal-root.vue";
import MtModalClose from "./components/mt-modal/sub-components/mt-modal-close.vue";
import MtModalTrigger from "./components/mt-modal/sub-components/mt-modal-trigger.vue";
import MtModalAction from "./components/mt-modal/sub-components/mt-modal-action.vue";
import MtText from "./components/mt-text/mt-text.vue";
import MtInset from "./components/mt-inset/mt-inset.vue";
import MtThemeProvider from "./components/mt-theme-provider/mt-theme-provider.vue";
import TooltipDirective from "./directives/tooltip.directive";
import DeviceHelperPlugin from "./plugin/device-helper.plugin";
import MtTooltip from "./components/mt-tooltip/mt-tooltip.vue";
import MtTextEditor from "./components/mt-text-editor/mt-text-editor.vue";
import MtTextEditorToolbarButton from "./components/mt-text-editor/_internal/mt-text-editor-toolbar-button.vue";
import MtSearch from "./components/mt-search/mt-search.vue";
import MtUrlField from "./components/mt-url-field/mt-url-field.vue";
import MtUnitField from "./components/mt-unit-field/mt-unit-field.vue";
import MtEntityDataTable from "./components/mt-entity-data-table/mt-entity-data-table.vue";
import MtEntitySelect from "./components/mt-entity-select/mt-entity-select.vue";
import MtActionMenu from "./components/mt-action-menu/mt-action-menu.vue";
import MtActionMenuItem from "./components/mt-action-menu-item/mt-action-menu-item.vue";
import MtActionMenuGroup from "./components/mt-action-menu-group/mt-action-menu-group.vue";
import MtCollapsible from "./components/mt-collapsible/mt-collapsible.vue";
import MtCollapsibleTrigger from "./components/mt-collapsible/mt-collapsible-trigger.vue";
import MtCollapsibleContent from "./components/mt-collapsible/mt-collapsible-content.vue";
import {
  DropdownMenuRoot,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuSub,
} from "reka-ui";
// Import global styling
import "./assets/scss/all.scss";

// Importing types
import type { Filter, Option } from "./components/mt-data-table/mt-data-table.interfaces";

export {
  MtBanner,
  MtBadge,
  MtLoader,
  MtProgressBar,
  MtButton,
  MtCheckbox,
  MtRadioGroupRoot,
  MtRadioGroupIndicator,
  MtRadioGroupList,
  MtRadioGroupItem,
  MtRadioGroupCustomItem,
  MtColorpicker,
  MtDatepicker,
  MtDivider,
  MtEmailField,
  MtChart,
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
  MtHelpText,
  MtTabs,
  MtDataTable,
  MtPagination,
  MtSkeletonBar,
  MtToast,
  MtSnackbar,
  MtPromoBadge,
  MtStatusDot,
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
  MtEntitySelect,
  TooltipDirective,
  MtAvatar,
  MtActionMenu,
  MtActionMenuItem,
  MtActionMenuGroup,
  MtCollapsible,
  MtCollapsibleTrigger,
  MtCollapsibleContent,
  DropdownMenuRoot as MtDropdownMenuRoot,
  DropdownMenuPortal as MtDropdownMenuPortal,
  DropdownMenuTrigger as MtDropdownMenuTrigger,
  DropdownMenuSub as MtDropdownMenuSub,
  DeviceHelperPlugin,
  useSnackbar,
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
export type { Filter, Option, Toast, Snackbar, ChartOptions };
export type { Editor } from "@tiptap/vue-3";
export type { default as Link } from "@tiptap/extension-link";
