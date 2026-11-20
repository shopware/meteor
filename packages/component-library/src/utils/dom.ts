/**
 * uses the browser's copy function to copy a string
 */
export async function copyToClipboard(stringToCopy: string): Promise<void> {
  await navigator.clipboard.writeText(stringToCopy);
}

export default {
  copyToClipboard,
};
