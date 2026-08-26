import { context, _private, window } from "@shopware-ag/meteor-admin-sdk";
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
        return await context.compareIsShopwareVersion("<", "6.7.14.0");
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

    return await _private.context.isService();
  }, false);

  const permissionGranted = asyncComputed<boolean | null>(async () => {
    if (isLegacySWVersionEvaluating.value || isLegacySWVersion.value === null) {
      return null;
    }

    try {
      if (isLegacySWVersion.value) {
        return await context.can("system_config:read");
      }

      return await _private.permissions.isGranted();
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
      return permissionGranted.value;
    }

    return isService.value && !permissionGranted.value;
  });

  async function grant(): Promise<void> {
    if (isLegacySWVersionEvaluating.value) return;

    if (isLegacySWVersion.value === null) return;

    if (isLegacySWVersion.value) {
      try {
        await window.routerPush({ path: shopwareServicePagePath });
      } catch (error) {
        console.error("Error granting permission:", error);
      }

      return;
    }

    if (isGranting.value) return;

    isGranting.value = true;

    try {
      await _private.permissions.grant();
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
