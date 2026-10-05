import { inject, type InjectionKey, type Ref } from "vue";
import type { MtChatStatus } from "@/types/ai";

/**
 * The state and actions of the surrounding `mt-prompt-field`, for custom parts in its slots.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export interface MtPromptFieldContext {
  status: Readonly<Ref<MtChatStatus>>;
  disabled: Readonly<Ref<boolean>>;
  files: Readonly<Ref<File[]>>;
  addFiles(files: File[] | FileList): void;
  removeFile(file: File): void;
  openFileDialog(): void;
  submit(): void;
  stop(): void;
  focus(): void;
}

export const promptFieldContextKey = Symbol(
  "mt-prompt-field",
) as InjectionKey<MtPromptFieldContext>;

export function usePromptFieldContext(component: string): MtPromptFieldContext {
  const context = inject(promptFieldContextKey, null);
  if (!context) throw new Error(`<${component}> must be used inside <mt-prompt-field>.`);

  return context;
}

/**
 * Gives a component inside an `mt-prompt-field` slot access to the field's status and files and
 * lets it add files, open the file dialog, submit, stop or focus the field.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export function useMtPromptField(): MtPromptFieldContext {
  return usePromptFieldContext("useMtPromptField");
}
