import { createSender } from '../channel';
import { findExtensionNameByBaseUrl } from '../_internals/utils';

/**
 * Dispatch a telemetry event to the Admin.
 * The source (technical name of the extension) is automatically
 * resolved by the Admin SDK from the message origin and cannot be
 * set manually by the extension.
 */
export const dispatch = createSender('telemetryDispatch');

/**
 * Resolves the technical name of the extension for the given origin URL.
 * Used on the Admin side when handling a telemetry event to inject the
 * source before forwarding the event to the tracking system.
 */
export const getSourceExtensionName = findExtensionNameByBaseUrl;

/**
 * Dispatch a telemetry event from an extension.
 * The `source` field is not part of the extension-facing API — it is
 * injected by the Admin after resolving the sender via {@link getSourceExtensionName}.
 */
export type telemetryDispatch = {
  responseType: void,

  /**
   * The name of the event to track.
   */
  event: string,

  /**
   * Optional data to associate with the event.
   */
  data?: Record<string, unknown>,
}
