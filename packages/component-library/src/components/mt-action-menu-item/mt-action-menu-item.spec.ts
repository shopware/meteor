import { render, screen } from "@testing-library/vue";
import { defineComponent } from "vue";
import { DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "../mt-action-menu/mt-action-menu.vue";
import MtActionMenuItem from "./mt-action-menu-item.vue";

function renderItem(icon: string) {
  const Menu = defineComponent({
    components: { DropdownMenuRoot, DropdownMenuTrigger, MtActionMenu, MtActionMenuItem },
    setup: () => ({ icon }),
    template: `
      <DropdownMenuRoot :open="true">
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <mt-action-menu>
          <mt-action-menu-item :icon="icon">Duplicate</mt-action-menu-item>
        </mt-action-menu>
      </DropdownMenuRoot>
    `,
  });

  return render(Menu);
}

describe("mt-action-menu-item", () => {
  it.each(["duplicate", "regular-duplicate", "solid-duplicate"])(
    "shows the icon %s in the regular style",
    async (icon) => {
      // ACT
      renderItem(icon);

      // ASSERT
      expect(await screen.findByTestId("mt-icon__regular-duplicate")).toBeInTheDocument();
    },
  );
});
