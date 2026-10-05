/**
 * The state of an AI request: `ready` waits for input, `submitted` waits for the first response,
 * `streaming` receives the response, and `error` ended with an error. The same values as the
 * `status` of the AI SDK's `useChat()`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export type MtChatStatus = "ready" | "submitted" | "streaming" | "error";

/**
 * The state of a tool call, the same values as the `state` of an AI SDK tool part:
 *
 * - `input-streaming`: the model is still writing the input.
 * - `input-available`: the tool runs.
 * - `approval-requested`: the call waits for the user's approval.
 * - `approval-responded`: the user answered, and the result is pending.
 * - `output-available`: the tool returned a result.
 * - `output-error`: the tool failed.
 * - `output-denied`: the user declined the call.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export type MtToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";

/**
 * The approval of a tool call, shaped like the `approval` of an AI SDK tool part. `approved` is
 * missing until the user answered.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export interface MtToolApproval {
  id: string;
  approved?: boolean;
  reason?: string;
}
