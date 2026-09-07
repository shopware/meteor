import { computed, defineComponent, h, ref, type PropType } from "vue";
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "../../mt-action-menu/mt-action-menu.vue";
import MtActionMenuGroup from "../../mt-action-menu-group/mt-action-menu-group.vue";
import MtActionMenuItem from "../../mt-action-menu-item/mt-action-menu-item.vue";
import MtAvatar from "../../mt-avatar/mt-avatar.vue";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtLoader from "../../mt-loader/mt-loader.vue";
import MtText from "../../mt-text/mt-text.vue";
import type { StoryUser } from "./entries";
import "./story-user-footer.css";

const HIDE_ON_COLLAPSE = "mt-sidebar__hide-on-collapse";

/**
 * Example content for the `footer` slot: the current user with an action menu, as the Shopware
 * Administration renders it. Applications build their own footer the same way.
 */
export const StoryUserFooter = defineComponent({
  name: "StoryUserFooter",
  props: {
    user: { type: Object as PropType<StoryUser>, default: undefined },
    isLoading: { type: Boolean, default: false },
    version: { type: String, default: undefined },
  },
  emits: {
    action: (_name: "Profile" | "Logout") => true,
  },
  setup(props, { emit }) {
    const open = ref(false);

    const userName = computed(() =>
      [props.user?.firstName, props.user?.lastName].filter(Boolean).join(" "),
    );

    // The collapsed sidebar hides the visible name, leaving the avatar button unnamed
    const ariaLabel = computed(() =>
      [userName.value, props.user?.title].filter(Boolean).join(", "),
    );

    const renderUser = () => [
      props.isLoading ? h(MtLoader, { size: "32px" }) : null,
      h(MtAvatar, {
        class: "story-user-footer__avatar",
        size: "s",
        imageUrl: props.user?.avatarUrl,
        firstName: props.user?.firstName,
        lastName: props.user?.lastName,
      }),
      h("div", { class: ["story-user-footer__fields", HIDE_ON_COLLAPSE] }, [
        h(
          MtText,
          { as: "div", class: "story-user-footer__name", size: "xs", weight: "semibold" },
          () => userName.value,
        ),
        h(
          MtText,
          {
            as: "div",
            class: "story-user-footer__title",
            size: "2xs",
            color: "color-text-secondary-default",
          },
          () => props.user?.title,
        ),
      ]),
      h("div", { class: "story-user-footer__chevrons" }, [
        h(MtIcon, { class: HIDE_ON_COLLAPSE, name: "regular-chevron-up-xs", size: "8" }),
        h(MtIcon, { class: HIDE_ON_COLLAPSE, name: "regular-chevron-down-xs", size: "8" }),
      ]),
    ];

    const renderMenu = () =>
      h(
        MtActionMenu,
        { class: "story-user-footer__menu", matchTriggerWidth: true, sideOffset: 4, side: "top" },
        () => [
          h(MtActionMenuGroup, null, () => [
            h(
              MtActionMenuItem,
              { icon: "regular-user", onClick: () => emit("action", "Profile") },
              () => "Profile",
            ),
            h(
              MtActionMenuItem,
              {
                icon: "regular-sign-out",
                variant: "critical",
                onClick: () => emit("action", "Logout"),
              },
              () => "Logout",
            ),
          ]),
          props.version
            ? h(MtActionMenuGroup, null, () =>
                h(
                  MtText,
                  {
                    as: "div",
                    class: "story-user-footer__version",
                    size: "2xs",
                    color: "color-text-secondary-default",
                  },
                  () => `Version: ${props.version}`,
                ),
              )
            : null,
        ],
      );

    return () =>
      h(
        DropdownMenuRoot,
        { open: open.value, "onUpdate:open": (value: boolean) => (open.value = value) },
        () => [
          h(DropdownMenuTrigger, { asChild: true }, () =>
            h(
              "button",
              {
                type: "button",
                class: ["story-user-footer", { "is--active": open.value }],
                "aria-label": ariaLabel.value,
              },
              renderUser(),
            ),
          ),
          h(DropdownMenuPortal, null, renderMenu),
        ],
      );
  },
});
