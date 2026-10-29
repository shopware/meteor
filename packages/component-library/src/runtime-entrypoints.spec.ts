import { describe, expect, it, afterEach } from "vitest";
import * as root from "./index";
import MtDropdownMenuRoot, { MtDropdownMenuRoot as NamedRoot } from "./MtDropdownMenuRoot";
import MtDropdownMenuPortal from "./MtDropdownMenuPortal";
import MtDropdownMenuTrigger from "./MtDropdownMenuTrigger";
import MtDropdownMenuSub from "./MtDropdownMenuSub";
import { useTheme } from "./useTheme";
import { useSnackbar } from "./useSnackbar";

describe("granular runtime entrypoints", () => {
  afterEach(() => root.useSnackbar().clearSnackbars());

  it("re-exports the same dropdown definitions as the package root", () => {
    expect(MtDropdownMenuRoot).toBe(root.MtDropdownMenuRoot);
    expect(NamedRoot).toBe(MtDropdownMenuRoot);
    expect(MtDropdownMenuPortal).toBe(root.MtDropdownMenuPortal);
    expect(MtDropdownMenuTrigger).toBe(root.MtDropdownMenuTrigger);
    expect(MtDropdownMenuSub).toBe(root.MtDropdownMenuSub);
  });

  it("re-exports the same theme and snackbar functions", () => {
    expect(useTheme).toBe(root.useTheme);
    expect(useSnackbar).toBe(root.useSnackbar);
  });

  it("shares notification state with consumers of the package root", () => {
    const granular = useSnackbar();
    const original = root.useSnackbar();
    const notification = granular.addSnackbar({ message: "Saved through the granular entrypoint" });
    expect(original.snackbars.value).toHaveLength(1);
    expect(original.snackbars.value[0].id).toBe(notification.id);
    original.removeSnackbar(notification.id);
    expect(granular.snackbars.value).toHaveLength(0);
  });
});
