import { inject, type InjectionKey, type Ref } from "vue";
import type { MtToolApproval, MtToolState } from "@/types/ai";

export interface ConfirmationContext {
  approval: Readonly<Ref<MtToolApproval | undefined>>;
  state: Readonly<Ref<MtToolState>>;
}

export const confirmationContextKey = Symbol(
  "mt-confirmation",
) as InjectionKey<ConfirmationContext>;

export function useConfirmationContext(component: string): ConfirmationContext {
  const context = inject(confirmationContextKey, null);
  if (!context) throw new Error(`<${component}> must be used inside <mt-confirmation>.`);

  return context;
}

/** The states in which the user's answer is known. */
export const ANSWERED_STATES: readonly MtToolState[] = [
  "approval-responded",
  "output-denied",
  "output-available",
];
