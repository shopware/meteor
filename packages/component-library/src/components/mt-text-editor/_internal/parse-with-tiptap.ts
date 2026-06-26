import { Editor as CoreEditor, type Extension } from "@tiptap/core";

/**
 * Dry-run parse HTML through a temporary TipTap Editor instance and return serialized HTML.
 * Uses the same extensions list that the live editor uses to mirror behavior.
 * No DOM attachment is required; the instance is created and destroyed in memory.
 */
export async function parseWithTiptap(html: string, extensions: Extension[]): Promise<string> {
  const initialContent = html ?? "";

  const temp = new CoreEditor({
    extensions,
    content: initialContent,
  });

  try {
    return temp.getHTML();
  } finally {
    temp.destroy();
  }
}
