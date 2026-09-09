import { location } from "@shopware-ag/meteor-admin-sdk";

if (location.is(location.MAIN_HIDDEN)) {
  // Executed by the administration in a hidden iFrame: register the module.
  import("./init");
} else {
  // Executed when the administration renders our location.
  import("./bootstrap");
}
