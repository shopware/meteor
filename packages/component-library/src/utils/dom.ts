/**
 * uses the browser's copy function to copy a string
 */
export function copyToClipboard(stringToCopy: string): void {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = stringToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

export default {
  copyToClipboard,
};
