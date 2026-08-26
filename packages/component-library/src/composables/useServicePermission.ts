import { can, compareIsShopwareVersion } from "@shopware-ag/meteor-admin-sdk/es/context";
import { isService as checkIsService } from "@shopware-ag/meteor-admin-sdk/es/_private/context";
import {
  grant as grantPermission,
  isGranted,
} from "@shopware-ag/meteor-admin-sdk/es/_private/permissions";
import { routerPush } from "@shopware-ag/meteor-admin-sdk/es/window";
import { asyncComputed } from "@vueuse/core";
import { computed, ref } from "vue";
import type { ComputedRef, Ref } from "vue";

const shopwareServicePagePath = "/sw/settings/services/index";

export interface UseServicePermissionReturn {
  /** Whether the current Shopware version predates native service permissions. */
  isLegacySWVersion: Ref<boolean | null>;
  /** Whether the Shopware version check is still running. */
  isLegacySWVersionEvaluating: Ref<boolean>;
  /** Whether a native service permission request is currently running. */
  isGranting: Ref<boolean>;
  /** Whether the current extension is running as a Shopware Service. */
  isService: Ref<boolean>;
  /** Whether the required permission is granted, or `null` when it cannot be resolved. */
  permissionGranted: Ref<boolean | null>;
  /** Whether permission-related UI should be displayed. */
  isShowPermissionUI: ComputedRef<boolean>;
  /** Grants native service permissions or opens the Services page on legacy Shopware versions. */
  grant: () => Promise<void>;
}

/** Resolves and grants permissions required by a Shopware Service. */
export function useServicePermission(): UseServicePermissionReturn {
  const isGranting = ref(false);
  const isLegacySWVersionEvaluating = ref(true);

  const isLegacySWVersion = asyncComputed<boolean | null>(
    async () => {
      try {
        return await compareIsShopwareVersion("<", "6.7.14.0");
      } catch {
        return null;
      }
    },
    null,
    { evaluating: isLegacySWVersionEvaluating },
  );

  const isService = asyncComputed(async () => {
    if (
      isLegacySWVersionEvaluating.value ||
      isLegacySWVersion.value === null ||
      isLegacySWVersion.value
    ) {
      return false;
    }

    return await checkIsService();
  }, false);

  const permissionGranted = asyncComputed<boolean | null>(async () => {
    if (isLegacySWVersionEvaluating.value || isLegacySWVersion.value === null) {
      return null;
    }

    try {
      if (isLegacySWVersion.value) {
        return await can("system_config:read");
      }

      return await isGranted();
    } catch {
      return null;
    }
  }, null);

  const isShowPermissionUI = computed(() => {
    if (
      isLegacySWVersionEvaluating.value ||
      isLegacySWVersion.value === null ||
      permissionGranted.value === null
    ) {
      return false;
    }

    if (isLegacySWVersion.value) {
      return !permissionGranted.value;
    }

    return isService.value && !permissionGranted.value;
  });

  async function grant(): Promise<void> {
    if (isLegacySWVersionEvaluating.value) return;

    if (isLegacySWVersion.value === null) return;

    if (isLegacySWVersion.value) {
      try {
        await routerPush({ path: shopwareServicePagePath });
      } catch (error) {
        console.error("Error granting permission:", error);
      }

      return;
    }

    if (isGranting.value) return;

    isGranting.value = true;

    try {
      await grantPermission();
    } catch (error) {
      console.error("Error granting permission:", error);
    } finally {
      isGranting.value = false;
    }
  }

  return {
    isLegacySWVersion,
    isLegacySWVersionEvaluating,
    isGranting,
    isService,
    permissionGranted,
    isShowPermissionUI,
    grant,
  };
}
