import { createSender } from '../channel';
import { findExtensionNameByBaseUrl } from '../_internals/utils';

/**
 * Matches the TrackableType used by the Admin analytics gateway.
 */
type TrackableType = string | string[] | number | boolean | null;

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
 * Track a page view, matching the `page_viewed` event emitted by the Admin.
 * Use this instead of `dispatch` to ensure consistent property names.
 */
export function trackPageView(properties: {
  sw_route_from_href: string,
  sw_route_from_name: string | null,
  sw_route_to_href: string,
  sw_route_to_name: string | null,
  sw_route_to_query?: string,
  [key: string]: TrackableType | undefined,
}): Promise<void> {
  return dispatch({ event: 'page_viewed', data: properties });
}

/**
 * Track a link visit, matching the `link_visited` event emitted by the Admin.
 * Use this instead of `dispatch` to ensure consistent property names.
 */
export function trackLinkVisited(properties: {
  sw_link_href: string,
  sw_link_type: 'internal' | 'external',
  [key: string]: TrackableType | undefined,
}): Promise<void> {
  return dispatch({ event: 'link_visited', data: properties });
}

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
