import type { MtToolState } from "@/types/ai";

type StatusDotVariant = "neutral" | "info" | "attention" | "critical" | "positive";

/** The status dot of a step, shared by the AI components so their colors match. */
export const STEP_DOT_VARIANTS = {
  complete: "positive",
  active: "info",
  pending: "neutral",
  error: "critical",
} as const satisfies Record<string, StatusDotVariant>;

/** The status dot, and badge, of a tool call per state. */
export const TOOL_DOT_VARIANTS: Record<MtToolState, StatusDotVariant> = {
  "input-streaming": "neutral",
  "input-available": "info",
  "approval-requested": "attention",
  "approval-responded": "info",
  "output-available": "positive",
  "output-error": "critical",
  "output-denied": "attention",
};
