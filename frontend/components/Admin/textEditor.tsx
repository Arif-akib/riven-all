"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here...",
}: any) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded bg-white">
      <div className="flex gap-2 border-b border-gray-300 p-1 text-xs">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`border border-gray-300 size-5 active:scale-90 ${editor.isActive("bold") ? "font-bold text-black bg-gray-300" : ""}`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`border border-gray-300 size-5 active:scale-90 ${editor.isActive("italic") ? "italic text-black bg-gray-300" : ""}`}
        >
          I
        </button>
      </div>

      <EditorContent editor={editor} className="p-1" />
    </div>
  );
}
