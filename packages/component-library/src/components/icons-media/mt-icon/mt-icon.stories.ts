import MtIcon from "./mt-icon.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import iconMeta from "@shopware-ag/meteor-icon-kit/icons/meta.json";
import MtSnackbar from "../../feedback-indicator/mt-snackbar/mt-snackbar.vue";
import { useSnackbar } from "../../feedback-indicator/mt-snackbar/composables/use-snackbar";
import MtEmptyState from "../../layout/mt-empty-state/mt-empty-state.vue";
import MtSearch from "../../navigation/mt-search/mt-search.vue";
import MtTabs from "../../navigation/mt-tabs/mt-tabs.vue";
import MtPagination from "../../table-and-list/mt-pagination/mt-pagination.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

type IconMetaEntry = {
  mode: "regular" | "solid";
  name: string;
  tags: string[];
};

const iconTagsByFullName = new Map(
  (iconMeta as IconMetaEntry[]).map((icon) => [`${icon.mode}-${icon.name}`, icon.tags]),
);

const allIcons = Object.keys(
  import.meta.glob("/node_modules/@shopware-ag/meteor-icon-kit/icons/**/*.svg"),
)
  .map((path) => {
    const relativePath = path
      .replace("/node_modules/@shopware-ag/meteor-icon-kit/icons/", "")
      .replace(".svg", "");

    const [mode, ...nameParts] = relativePath.split("/");
    const name = nameParts.join("-");

    return {
      fullName: `${mode}-${name}`,
      mode: mode as "regular" | "solid",
      name,
      tags: iconTagsByFullName.get(`${mode}-${name}`) ?? [],
    };
  })
  .sort((iconA, iconB) => iconA.fullName.localeCompare(iconB.fullName));

export type MtIconMeta = SlottedMeta<typeof MtIcon, "default">;

const meta: MtIconMeta = {
  title: "Components/mt-icon",
  component: MtIcon,
  render: (args) => ({
    components: { MtIcon },
    template: '<mt-icon v-bind="args"></mt-icon>',
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    name: "products",
    mode: "regular",
    color: "var(--color-icon-primary-default)",
    decorative: false,
  },
  argTypes: {
    style: {
      control: "object",
    },
  },
};

export default meta;
export type MtIconStory = StoryObj<MtIconMeta>;

export const Default: MtIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-icon
  name="products"
  mode="regular"
  color="var(--color-icon-primary-default)"
/>`,
      },
    },
  },
};

export const ModeProp: MtIconStory = {
  name: "Mode",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-icon
  name="calendar"
  mode="regular"
  size="var(--scale-size-20)"
/>
<mt-icon
  name="calendar"
  mode="solid"
  size="var(--scale-size-20)"
/>`,
      },
    },
  },
  render: () => ({
    components: { MtIcon },
    template: `
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <div style="display: grid; gap: 8px; justify-items: center;">
          <mt-icon
            name="calendar"
            mode="regular"
            size="var(--scale-size-20)"
            color="var(--color-icon-primary-default)"
          />
          <span>Regular</span>
        </div>
        <div style="display: grid; gap: 8px; justify-items: center;">
          <mt-icon
            name="calendar"
            mode="solid"
            size="var(--scale-size-20)"
            color="var(--color-icon-primary-default)"
          />
          <span>Solid</span>
        </div>
      </div>
    `,
  }),
};

export const PreferredSizes: MtIconStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-icon name="products" mode="regular" size="var(--scale-size-24)" />
<mt-icon name="products" mode="regular" size="var(--scale-size-20)" />
<mt-icon name="products" mode="regular" size="var(--scale-size-16)" />

<!-- Smaller exceptions for dense UI -->
<mt-icon name="pencil-s" mode="solid" size="var(--scale-size-14)" />
<mt-icon name="clock" mode="solid" size="var(--scale-size-12)" />
<mt-icon name="chevron-right-s" mode="regular" size="var(--scale-size-10)" />`,
      },
    },
  },
  render: () => ({
    components: { MtIcon },
    template: `
      <div style="display: grid; gap: 20px;">
        <div style="display: grid; gap: 12px;">
          <strong>Preferred sizes</strong>
          <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: end;">
            <div style="display: grid; gap: 8px; justify-items: center; align-content: end;">
              <mt-icon name="products" mode="regular" size="var(--scale-size-24)" color="var(--color-icon-primary-default)" />
              <span>24px</span>
            </div>
            <div style="display: grid; gap: 8px; justify-items: center; align-content: end;">
              <mt-icon name="products" mode="regular" size="var(--scale-size-20)" color="var(--color-icon-primary-default)" />
              <span>20px</span>
            </div>
            <div style="display: grid; gap: 8px; justify-items: center; align-content: end;">
              <mt-icon name="products" mode="regular" size="var(--scale-size-16)" color="var(--color-icon-primary-default)" />
              <span>16px</span>
            </div>
          </div>
        </div>

        <div style="display: grid; gap: 12px;">
          <strong>Smaller exceptions in dense UI</strong>
          <div style="display: flex; gap: 24px; flex-wrap: wrap; align-items: end;">
            <div style="display: grid; gap: 8px; justify-items: center; align-content: end;">
              <mt-icon name="pencil-s" mode="solid" size="var(--scale-size-14)" color="var(--color-icon-primary-default)" />
              <span>14px</span>
            </div>
            <div style="display: grid; gap: 8px; justify-items: center; align-content: end;">
              <mt-icon name="clock" mode="solid" size="var(--scale-size-12)" color="var(--color-icon-primary-default)" />
              <span>12px</span>
            </div>
            <div style="display: grid; gap: 8px; justify-items: center; align-content: end;">
              <mt-icon name="chevron-right-s" mode="regular" size="var(--scale-size-10)" color="var(--color-icon-primary-default)" />
              <span>10px</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ColorTokens: MtIconStory = {
  name: "Colors",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-icon name="cog" mode="solid" color="var(--color-icon-primary-default)" />
<mt-icon name="ban" mode="solid" color="var(--color-icon-secondary-default)" />
<mt-icon name="info-circle" mode="solid" color="var(--color-icon-brand-default)" />
<mt-icon name="exclamation-triangle" mode="solid" color="var(--color-icon-attention-default)" />
<mt-icon name="exclamation-circle" mode="solid" color="var(--color-icon-critical-default)" />
<mt-icon name="check-circle" mode="solid" color="var(--color-icon-positive-default)" />
<mt-icon name="link" mode="solid" color="var(--color-icon-accent-default)" />`,
      },
    },
  },
  render: () => ({
    components: { MtIcon },
    setup() {
      return {
        colorExamples: [
          {
            color: "var(--color-icon-primary-default)",
            name: "cog",
            mode: "solid" as const,
          },
          {
            color: "var(--color-icon-secondary-default)",
            name: "ban",
            mode: "solid" as const,
          },
          {
            color: "var(--color-icon-brand-default)",
            name: "info-circle",
            mode: "solid" as const,
          },
          {
            color: "var(--color-icon-attention-default)",
            name: "exclamation-triangle",
            mode: "solid" as const,
          },
          {
            color: "var(--color-icon-critical-default)",
            name: "exclamation-circle",
            mode: "solid" as const,
          },
          {
            color: "var(--color-icon-positive-default)",
            name: "check-circle",
            mode: "solid" as const,
          },
          {
            color: "var(--color-icon-accent-default)",
            name: "link",
            mode: "solid" as const,
          },
        ],
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <div
          v-for="example in colorExamples"
          :key="example.color"
          style="display: grid; grid-template-columns: 24px 1fr; gap: 12px; align-items: center;"
        >
          <mt-icon
            :name="example.name"
            :mode="example.mode"
            size="var(--scale-size-20)"
            :color="example.color"
            decorative
          />
          <code>{{ example.color }}</code>
        </div>
      </div>
    `,
  }),
};

export const CommonUsages: MtIconStory = {
  name: "Common usages",
  render: () => ({
    components: { MtIcon },
    setup() {
      return {
        commonUsages: [
          { icon: "tachometer", label: "Dashboard" },
          { icon: "products", label: "Products" },
          { icon: "shopping-bag", label: "Orders" },
          { icon: "users", label: "Customers" },
          { icon: "content", label: "Content" },
          { icon: "megaphone", label: "Marketing" },
          { icon: "plug", label: "Extensions" },
          { icon: "cog", label: "Settings" },
          { icon: "storefront", label: "Sales Channels" },
          { icon: "shopping-cart", label: "Shopping cart" },
          { icon: "search", label: "Search" },
          { icon: "sign-in", label: "Login/Signup" },
          { icon: "sign-out", label: "Logout" },
          { icon: "database", label: "Import/Export" },
          { icon: "rule", label: "Rule Builder" },
          { icon: "flow", label: "Flow Builder" },
          { icon: "image", label: "Media" },
          { icon: "file-text", label: "Documents" },
          { icon: "credit-card", label: "Payment methods" },
          { icon: "truck", label: "Shipping" },
          { icon: "analytics", label: "Analytics" },
          { icon: "user", label: "Users" },
          { icon: "plans", label: "Shopware Plans" },
          { icon: "copy", label: "Copy" },
          { icon: "times", label: "Close" },
        ],
      };
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <p style="color: var(--color-text-secondary-default); max-width: 72ch;">
          These examples demonstrate typical icon usage in the Shopware Administration and other Shopware products that use Meteor, where each icon has a clearly defined meaning.
        </p>

        <div
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(256px, 1fr)); gap: 12px;"
        >
          <div
            v-for="usage in commonUsages"
            :key="usage.icon"
            style="display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 12px; align-items: center; padding: 12px 16px; border: 1px solid var(--color-border-secondary-default); border-radius: var(--border-radius-m); background: var(--color-background-primary-default); min-width: 0;"
          >
            <div
              style="width: 40px; height: 40px; display: grid; place-items: center; border-radius: var(--border-radius-s); background: var(--color-background-tertiary-default);"
            >
              <mt-icon
                :name="usage.icon"
                mode="regular"
                size="var(--scale-size-20)"
                color="var(--color-icon-primary-default)"
                decorative
              />
            </div>

            <div style="display: grid; gap: 4px; min-width: 0; font-size: var(--font-size-xs); color: var(--color-text-primary-default);">
              <strong>{{ usage.label }}</strong>
              <code style="font-size: var(--font-size-2xs); color: var(--color-text-secondary-default);">{{ usage.icon }}</code>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const SearchableBrowser: MtIconStory = {
  name: "All icons",
  render: () => ({
    components: { MtEmptyState, MtIcon, MtPagination, MtSearch, MtSnackbar, MtTabs },
    setup() {
      const { addSnackbar } = useSnackbar();
      const itemsPerPage = 48;
      const searchTerm = ref("");
      const activeMode = ref<"all" | "regular" | "solid">("all");
      const currentPage = ref(1);
      const hoveredIconName = ref<string | null>(null);
      const focusVisibleIconName = ref<string | null>(null);
      const lastInteractionWasKeyboard = ref(false);
      const searchMatchedIcons = computed(() => {
        const term = searchTerm.value.trim().toLowerCase();

        return allIcons.filter((icon) => {
          if (!term) {
            return true;
          }

          return (
            icon.name.toLowerCase().includes(term) ||
            icon.fullName.toLowerCase().includes(term) ||
            icon.tags.some((tag) => tag.toLowerCase().includes(term))
          );
        });
      });

      const modeTabs = computed(() => {
        const regularCount = searchMatchedIcons.value.filter(
          (icon) => icon.mode === "regular",
        ).length;
        const solidCount = searchMatchedIcons.value.filter((icon) => icon.mode === "solid").length;

        return [
          { label: "All", name: "all" },
          { label: `Regular (${regularCount})`, name: "regular" },
          { label: `Solid (${solidCount})`, name: "solid" },
        ];
      });

      const filteredIcons = computed(() => {
        return searchMatchedIcons.value.filter((icon) => {
          return activeMode.value === "all" || icon.mode === activeMode.value;
        });
      });

      watch([searchTerm, activeMode], () => {
        currentPage.value = 1;
      });

      const visibleIcons = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return filteredIcons.value.slice(startIndex, endIndex);
      });

      const handleKeyboardInteraction = () => {
        lastInteractionWasKeyboard.value = true;
      };

      const handlePointerInteraction = () => {
        lastInteractionWasKeyboard.value = false;
      };

      onMounted(() => {
        globalThis.window?.addEventListener("keydown", handleKeyboardInteraction, true);
        globalThis.window?.addEventListener("mousedown", handlePointerInteraction, true);
        globalThis.window?.addEventListener("pointerdown", handlePointerInteraction, true);
        globalThis.window?.addEventListener("touchstart", handlePointerInteraction, true);
      });

      onBeforeUnmount(() => {
        globalThis.window?.removeEventListener("keydown", handleKeyboardInteraction, true);
        globalThis.window?.removeEventListener("mousedown", handlePointerInteraction, true);
        globalThis.window?.removeEventListener("pointerdown", handlePointerInteraction, true);
        globalThis.window?.removeEventListener("touchstart", handlePointerInteraction, true);
      });

      const getCardStyle = (iconName: string) => {
        const isHighlighted =
          hoveredIconName.value === iconName || focusVisibleIconName.value === iconName;
        const isFocusVisible = focusVisibleIconName.value === iconName;

        return {
          display: "grid",
          gap: "12px",
          alignItems: "start",
          justifyItems: "center",
          textAlign: "center",
          padding: "16px",
          borderRadius: "var(--border-radius-m)",
          border: "1px solid var(--color-border-secondary-default)",
          cursor: "pointer",
          transition: "background-color 120ms ease-out",
          backgroundColor: isHighlighted
            ? "var(--color-interaction-secondary-hover)"
            : "var(--color-interaction-secondary-default)",
          outline: isFocusVisible ? "2px solid var(--color-border-brand-default)" : "none",
          outlineOffset: isFocusVisible ? "2px" : "0px",
        };
      };

      const setHoveredIcon = (iconName: string | null) => {
        hoveredIconName.value = iconName;
      };

      const setFocusedIcon = (iconName: string) => {
        focusVisibleIconName.value = lastInteractionWasKeyboard.value ? iconName : null;
      };

      const clearFocusedIcon = () => {
        focusVisibleIconName.value = null;
      };

      const copyIconName = async (iconName: string) => {
        if (!globalThis.navigator?.clipboard?.writeText) {
          return;
        }

        try {
          await globalThis.navigator.clipboard.writeText(iconName);
          addSnackbar({
            message: `Copied ${iconName} to clipboard`,
            variant: "success",
          });
        } catch {
          addSnackbar({
            message: `Couldn't copy ${iconName}`,
            variant: "error",
          });
        }
      };

      return {
        activeMode,
        copyIconName,
        currentPage,
        filteredIcons,
        clearFocusedIcon,
        itemsPerPage,
        getCardStyle,
        modeTabs,
        searchTerm,
        setFocusedIcon,
        setHoveredIcon,
        visibleIcons,
      };
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <mt-search
          v-model="searchTerm"
          placeholder="Search icons by name..."
        />

        <div style="width: 100%; margin-bottom: 8px;">
          <mt-tabs
            :items="modeTabs"
            style="width: 100%;"
            :default-item="activeMode"
            @new-item-active="activeMode = $event"
          />
        </div>

        <div
          v-if="filteredIcons.length"
          style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;"
        >
          <div
            v-for="icon in visibleIcons"
            :key="icon.fullName"
            role="button"
            tabindex="0"
            :aria-label="'Copy ' + icon.fullName + ' icon name'"
            :title="'Copy ' + icon.fullName"
            :style="getCardStyle(icon.fullName)"
            @mouseenter="setHoveredIcon(icon.fullName)"
            @mouseleave="setHoveredIcon(null)"
            @focus="setFocusedIcon(icon.fullName)"
            @blur="clearFocusedIcon()"
            @click="copyIconName(icon.fullName)"
            @keydown.enter.prevent="copyIconName(icon.fullName)"
            @keydown.space.prevent="copyIconName(icon.fullName)"
          >
            <mt-icon
              :name="icon.name"
              :mode="icon.mode"
              size="var(--scale-size-24)"
              color="var(--color-icon-primary-default)"
              decorative
            />
            <span style="color: var(--color-text-secondary-default); font-size: var(--font-size-2xs); line-height: var(--font-line-height-2xs); font-weight: var(--font-weight-medium); word-break: break-word;">{{ icon.fullName }}</span>
          </div>
        </div>

        <div
          v-else
          style="width: 100%; display: flex; justify-content: center; margin-top: 16px;"
        >
          <mt-empty-state
            icon="regular-search"
            headline="No icons found"
            description="Try a different search term or switch the icon mode."
            centered
          />
        </div>

        <div v-if="filteredIcons.length > itemsPerPage" style="display: flex; justify-content: end;">
          <mt-pagination
            :current-page="currentPage"
            :limit="itemsPerPage"
            :total-items="filteredIcons.length"
            @change-current-page="currentPage = $event"
          />
        </div>

        <mt-snackbar />
      </div>
    `,
  }),
};
