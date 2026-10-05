import { inject, type InjectionKey, type Ref } from "vue";

export interface ReasoningContext {
  streaming: Readonly<Ref<boolean>>;
  duration: Readonly<Ref<number | undefined>>;
}

export const reasoningContextKey = Symbol("mt-reasoning") as InjectionKey<ReasoningContext>;

export function useReasoningContext(component: string): ReasoningContext {
  const context = inject(reasoningContextKey, null);
  if (!context) throw new Error(`<${component}> must be used inside <mt-reasoning>.`);

  return context;
}
