"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { CmsMediaUpload } from "@/components/admin/CmsMediaUpload";

type RichTextEditorProps = {
  slug: string;
  value: string;
  onChange: (html: string) => void;
};

const btnClass =
  "rounded-lg border border-adab-gray-300 px-2.5 py-1 text-xs font-semibold text-adab-navy-800 hover:bg-adab-cream disabled:opacity-50";

export function RichTextEditor({ slug, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-adab-navy-800 underline" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full" } }),
      Placeholder.configure({
        placeholder: "Write your post content here…",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[240px] px-4 py-3 outline-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function insertImage(url: string) {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 rounded-t-xl border border-b-0 border-adab-gray-300 bg-adab-cream/60 p-2">
        <button
          type="button"
          className={btnClass}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </button>
        <button type="button" className={btnClass} onClick={setLink}>
          Link
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unlink
        </button>
      </div>

      <div className="rounded-b-xl border border-adab-gray-300 bg-white">
        <EditorContent editor={editor} />
      </div>

      <CmsMediaUpload
        slug={slug}
        label="Insert image into content"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onUploaded={insertImage}
      />
    </div>
  );
}
