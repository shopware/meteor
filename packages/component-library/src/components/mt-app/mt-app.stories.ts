import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { h, ref, type Component } from "vue";
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtApp from "./mt-app.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtText from "../mt-text/mt-text.vue";
import MtTextField from "../mt-text-field/mt-text-field.vue";
import MtSwitch from "../mt-switch/mt-switch.vue";
import MtSelect from "../mt-select/mt-select.vue";
import MtPopover from "../mt-popover/mt-popover.vue";
import MtPopoverItem from "../mt-popover-item/mt-popover-item.vue";
import MtActionMenu from "../mt-action-menu/mt-action-menu.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";
import MtModalRoot from "../mt-modal/sub-components/mt-modal-root.vue";
import MtModalTrigger from "../mt-modal/sub-components/mt-modal-trigger.vue";
import MtModal from "../mt-modal/mt-modal.vue";
import MtThemeSelect from "../mt-theme-select/mt-theme-select.vue";
import { useSnackbar } from "../mt-snackbar/composables/use-snackbar";
import { useMtApp } from "./composables/useMtApp";
import type { Theme } from "@/composables/useTheme";

export type MtAppMeta = Meta<typeof MtApp>;

/** Renders the shell state of `useMtApp()`; used by the Composable story and its tests. */
const ShellStatus: Component = {
  setup() {
    const app = useMtApp();

    return () =>
      h("div", { style: "display: grid; gap: var(--scale-size-8); justify-items: start;" }, [
        h(
          "output",
          { "data-testid": "shell-status" },
          `Layout: ${app.isMobile.value ? "mobile" : "desktop"} · Drawer: ${app.activeDrawer.value ?? "none"} · Theme: ${app.theme.value} (${app.resolvedTheme.value})`,
        ),
        h(
          MtButton,
          { variant: "secondary", size: "small", onClick: () => app.openDrawer("start") },
          () => "Open navigation drawer",
        ),
        h(
          MtButton,
          { variant: "secondary", size: "small", onClick: () => app.setTheme("dark") },
          () => "Use dark theme",
        ),
      ]);
  },
};

const sharedComponents = {
  MtApp,
  MtButton,
  MtCard,
  MtText,
  MtTextField,
  MtSwitch,
  MtSelect,
  MtPopover,
  MtPopoverItem,
  MtActionMenu,
  MtActionMenuItem,
  MtModalRoot,
  MtModalTrigger,
  MtModal,
  MtThemeSelect,
  MtDropdownMenuRoot: DropdownMenuRoot,
  MtDropdownMenuTrigger: DropdownMenuTrigger,
  MtDropdownMenuPortal: DropdownMenuPortal,
  ShellStatus,
};

const navItems = [
  "Dashboard",
  "Orders",
  "Customers",
  "Products",
  "Categories",
  "Reviews",
  "Promotions",
  "Newsletter",
  "Payments",
  "Shipping",
  "Taxes",
  "Rule builder",
  "Flow builder",
  "Media",
  "Content",
  "Themes",
  "Landing pages",
  "Analytics",
  "Reports",
  "Extensions",
  "Integrations",
  "Users",
  "Settings",
  "Help",
].map((label) => ({ label, href: `#${label.toLowerCase().replace(/\s+/g, "-")}` }));

const createCards = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    title: `Order #${10000 + index}`,
    subtitle: index % 2 === 0 ? "Open" : "Shipped",
  }));

const detailFields = ["Customer", "Email", "Shipping address", "Billing address", "Payment method"];

const shippingMethods = [
  { label: "Standard", value: "standard" },
  { label: "Express", value: "express" },
  { label: "Pickup", value: "pickup" },
];

const createRender = (template: string, cardCount = 12) =>
  function render(args: Record<string, unknown>) {
    return {
      components: sharedComponents,
      setup() {
        const { addSnackbar } = useSnackbar();
        const theme = ref<Theme>("light");
        const showHeader = ref(true);
        const showStart = ref(true);
        const showEnd = ref(true);
        const mobile = ref(false);
        const shippingMethod = ref("standard");

        function notify(variant: "success" | "error") {
          addSnackbar({
            message: variant === "success" ? "Order saved" : "The order could not be saved",
            variant,
          });
        }

        return {
          args,
          MtButton,
          navItems,
          cards: createCards(cardCount),
          detailFields,
          shippingMethods,
          shippingMethod,
          notify,
          theme,
          showHeader,
          showStart,
          showEnd,
          mobile,
        };
      },
      template,
    };
  };

const createStory = (template: string, cardCount?: number) => ({
  render: createRender(template, cardCount),
  parameters: {
    docs: {
      source: {
        code: template.trim(),
      },
    },
  },
});

const headerTemplate = `
  <template #header>
    <div style="display: flex; align-items: center; gap: var(--scale-size-16); min-height: var(--scale-size-48); padding-inline: var(--scale-size-16);">
      <mt-text as="span" size="s" weight="bold">Meteor Shop</mt-text>

      <div style="margin-inline-start: auto; display: flex; align-items: center; gap: var(--scale-size-8);">
        <mt-popover title="Account">
          <template #trigger="{ toggleFloatingUi }">
            <mt-button variant="secondary" size="small" @click.stop="toggleFloatingUi">Jane Doe</mt-button>
          </template>

          <template #popover-items__base>
            <mt-popover-item label="Profile" />
            <mt-popover-item label="Sign out" type="critical" />
          </template>
        </mt-popover>
      </div>
    </div>
  </template>`;

const navigationTemplate = `
  <template #sidebar-start>
    <nav aria-label="Main" style="display: grid; gap: var(--scale-size-16); width: 16rem; padding: var(--scale-size-16);">
      <mt-dropdown-menu-root>
        <mt-dropdown-menu-trigger as-child>
          <mt-button variant="secondary" size="small" block>More actions</mt-button>
        </mt-dropdown-menu-trigger>

        <mt-dropdown-menu-portal>
          <mt-action-menu>
            <mt-action-menu-item icon="file-text">Documentation</mt-action-menu-item>
            <mt-action-menu-item icon="copy">Copy link</mt-action-menu-item>
            <mt-action-menu-item icon="download">Download report</mt-action-menu-item>
          </mt-action-menu>
        </mt-dropdown-menu-portal>
      </mt-dropdown-menu-root>

      <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: var(--scale-size-4);">
        <li v-for="item in navItems" :key="item.label">
          <a
            :href="item.href"
            style="display: block; padding: var(--scale-size-8); border-radius: var(--border-radius-xs); color: var(--color-text-primary-default); text-decoration: none;"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <mt-modal-root>
        <mt-modal-trigger :as="MtButton" variant="secondary" size="small" block>Send feedback</mt-modal-trigger>

        <mt-modal title="Send feedback">
          <mt-text-field label="Your feedback" />

          <template #footer>
            <mt-button variant="primary" size="small">Send</mt-button>
          </template>
        </mt-modal>
      </mt-modal-root>
    </nav>
  </template>`;

const contentTemplate = `
  <template #content>
    <div style="display: grid; gap: var(--scale-size-16); padding: var(--scale-size-24);">
      <div style="display: flex; flex-wrap: wrap; gap: var(--scale-size-8);">
        <mt-button variant="primary" size="small" @click="notify('success')">Show success</mt-button>
        <mt-button variant="secondary" size="small" @click="notify('error')">Show error</mt-button>

        <mt-modal-root>
          <mt-modal-trigger :as="MtButton" variant="secondary" size="small">Open modal</mt-modal-trigger>

          <mt-modal title="Delete order">
            <mt-text size="xs">This action cannot be undone.</mt-text>

            <template #footer>
              <mt-button variant="critical" size="small">Delete</mt-button>
            </template>
          </mt-modal>
        </mt-modal-root>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--scale-size-16);">
        <mt-card v-for="card in cards" :key="card.title" :title="card.title" :subtitle="card.subtitle">
          <mt-text size="xs">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat.
          </mt-text>
        </mt-card>
      </div>
    </div>
  </template>`;

const detailsTemplate = `
  <template #sidebar-end>
    <form style="display: grid; gap: var(--scale-size-16); width: 18rem; padding: var(--scale-size-16);" @submit.prevent="notify('success')">
      <mt-text as="h2" size="s" weight="semibold">Order details</mt-text>
      <mt-text-field v-for="field in detailFields" :key="field" :label="field" />
      <mt-switch label="Notify customer" />
      <mt-button variant="primary" size="small" type="submit">Save</mt-button>
    </form>
  </template>`;

const defaultTemplate = `
<mt-app v-bind="args">
  ${headerTemplate}
  ${navigationTemplate}
  ${contentTemplate}
  ${detailsTemplate}
</mt-app>
`;

const contentOnlyTemplate = `
<mt-app v-bind="args">
  ${contentTemplate}
</mt-app>
`;

const headerAndNavigationTemplate = `
<mt-app v-bind="args">
  ${headerTemplate}
  ${navigationTemplate}
  ${contentTemplate}
</mt-app>
`;

const navigationOnlyTemplate = `
<mt-app v-bind="args">
  ${navigationTemplate}
  ${contentTemplate}
</mt-app>
`;

const themeControlledTemplate = `
<mt-app v-bind="args" v-model:theme="theme">
  <template #header>
    <div style="display: flex; align-items: center; justify-content: flex-end; min-height: var(--scale-size-48); padding-inline: var(--scale-size-16);">
      <mt-theme-select v-model="theme" label="Color theme" />
    </div>
  </template>

  <template #content>
    <div style="padding: var(--scale-size-24);">
      <shell-status />
    </div>
  </template>
</mt-app>
`;

const composableTemplate = `
<mt-app v-bind="args">
  ${navigationTemplate}

  <template #content>
    <div style="padding: var(--scale-size-24);">
      <shell-status />
    </div>
  </template>
</mt-app>
`;

const dynamicRegionsTemplate = `
<mt-app v-bind="args" :mobile-breakpoint="mobile ? 99999 : 0">
  <template v-if="showHeader" #header>
    <div style="display: flex; align-items: center; min-height: var(--scale-size-48); padding-inline: var(--scale-size-16);">
      <mt-text as="span" size="s" weight="bold">Meteor Shop</mt-text>
    </div>
  </template>

  <template v-if="showStart" #sidebar-start>
    <nav aria-label="Main" style="width: 16rem; padding: var(--scale-size-16);">
      <mt-text size="xs">Navigation</mt-text>
    </nav>
  </template>

  <template #content>
    <div style="display: flex; flex-wrap: wrap; gap: var(--scale-size-8); padding: var(--scale-size-24);">
      <mt-button variant="secondary" size="small" @click="showHeader = !showHeader">Toggle header</mt-button>
      <mt-button variant="secondary" size="small" @click="showStart = !showStart">Toggle start sidebar</mt-button>
      <mt-button variant="secondary" size="small" @click="showEnd = !showEnd">Toggle end sidebar</mt-button>
      <mt-button variant="secondary" size="small" @click="mobile = !mobile">Toggle mobile layout</mt-button>
    </div>
  </template>

  <template v-if="showEnd" #sidebar-end>
    <div style="width: 18rem; padding: var(--scale-size-16);">
      <mt-text size="xs">Details</mt-text>
    </div>
  </template>
</mt-app>
`;

const layeringTemplate = `
<mt-app v-bind="args">
  ${headerTemplate}

  <template #sidebar-start>
    <nav aria-label="Main" style="display: grid; gap: var(--scale-size-16); width: 16rem; padding: var(--scale-size-16);">
      <mt-popover title="Filters">
        <template #trigger="{ toggleFloatingUi }">
          <mt-button variant="secondary" size="small" block @click.stop="toggleFloatingUi">Filters</mt-button>
        </template>

        <template #popover-items__base>
          <mt-popover-item label="Open orders" />
          <mt-popover-item label="Shipped orders" />
        </template>
      </mt-popover>

      <mt-modal-root>
        <mt-modal-trigger :as="MtButton" variant="secondary" size="small" block>Edit order</mt-modal-trigger>

        <mt-modal title="Edit order">
          <mt-select v-model="shippingMethod" label="Shipping method" :options="shippingMethods" />

          <template #footer>
            <mt-button variant="primary" size="small" @click="notify('success')">Save</mt-button>
          </template>
        </mt-modal>
      </mt-modal-root>
    </nav>
  </template>

  ${contentTemplate}
</mt-app>
`;

const meta: MtAppMeta = {
  title: "Components/App",
  component: MtApp,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
  args: {
    mobileBreakpoint: 0,
    theme: "light",
    applyTheme: false,
    closeOnNavigate: true,
    "onUpdate:theme": fn(),
    "onDrawer-change": fn(),
  },
  argTypes: {
    mobileBreakpoint: {
      control: { type: "number" },
      description:
        "The viewport width in pixels below which the sidebars become off-canvas drawers. `0` disables the mobile layout.",
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "system"],
      description: "The controlled theme preference.",
    },
    closeOnNavigate: {
      control: { type: "boolean" },
      description: "Whether a Vue Router navigation closes the open drawer.",
    },
  },
};

export default meta;
export type MtAppStory = StoryObj<MtAppMeta>;

export const Default: MtAppStory = {
  ...createStory(defaultTemplate),
};

export const ContentOnly: MtAppStory = {
  ...createStory(contentOnlyTemplate),
  name: "Content only",
};

export const HeaderAndNavigation: MtAppStory = {
  ...createStory(headerAndNavigationTemplate),
  name: "Header and navigation",
};

export const NavigationOnly: MtAppStory = {
  ...createStory(navigationOnlyTemplate),
  name: "Navigation only",
};

export const LongContent: MtAppStory = {
  ...createStory(defaultTemplate, 48),
  name: "Long content",
};

export const Responsive: MtAppStory = {
  ...createStory(defaultTemplate),
  args: {
    mobileBreakpoint: 1280,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Uses the default mobile breakpoint of 1280px: resize the canvas to switch between inline sidebars and drawers.",
      },
    },
  },
};

export const Mobile: MtAppStory = {
  ...createStory(defaultTemplate),
  args: {
    mobileBreakpoint: 99999,
  },
};

export const MobileLongContent: MtAppStory = {
  ...createStory(defaultTemplate, 48),
  name: "Mobile with long content",
  args: {
    mobileBreakpoint: 99999,
  },
};

export const MobileHeaderless: MtAppStory = {
  ...createStory(navigationOnlyTemplate),
  name: "Mobile without header",
  args: {
    mobileBreakpoint: 99999,
  },
};

export const Layering: MtAppStory = {
  ...createStory(layeringTemplate),
  name: "Stacked overlays",
  args: {
    mobileBreakpoint: 99999,
  },
};

export const Dark: MtAppStory = {
  ...createStory(defaultTemplate),
  args: {
    theme: "dark",
  },
  globals: {
    theme: "dark",
  },
};

export const ThemeControlled: MtAppStory = {
  ...createStory(themeControlledTemplate),
  name: "Controlled theme",
  args: {
    theme: undefined,
  },
};

export const Composable: MtAppStory = {
  ...createStory(composableTemplate),
  name: "Reading the shell state",
};

export const DynamicRegions: MtAppStory = {
  ...createStory(dynamicRegionsTemplate),
  name: "Dynamic regions",
};

export const Embedded: MtAppStory = {
  ...createStory(`
<mt-app v-bind="args" style="--mt-app-height: 480px">
  ${headerTemplate}
  ${navigationTemplate}
  ${contentTemplate}
</mt-app>
`),
  args: {
    lockDocument: false,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "`--mt-app-height` sizes the shell when it does not own the viewport, and `lockDocument` is turned off so the page keeps scrolling.",
      },
    },
  },
};
