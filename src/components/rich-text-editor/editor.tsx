import Menubar from "@/components/rich-text-editor/menubar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

const Editor = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "dark:prose-invert prose prose-sm sm:prose lg:prose-lg xl:prose-xl min-h-[200px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: typeof window !== "undefined",

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value
      ? JSON.parse(field.value)
      : { type: "doc", content: [] },
  });

  if (!editor) return null;

  return (
    <div className="w-full border boder-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
