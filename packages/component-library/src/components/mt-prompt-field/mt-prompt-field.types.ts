/**
 * What `mt-prompt-field` emits with `submit`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export interface MtPromptFieldMessage {
  text: string;
  files: File[];
}

/**
 * Why `mt-prompt-field` rejected files: a type that `accept` does not allow, more files than
 * `maxFiles` or a file larger than `maxFileSize`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export interface MtPromptFieldError {
  code: "accept" | "max_files" | "max_file_size";
  message: string;
  files: File[];
}

/**
 * An option of `mt-prompt-field-model-select`.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
export interface MtPromptFieldModel {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
