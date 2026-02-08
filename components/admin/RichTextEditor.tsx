"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import ImageResize from "tiptap-extension-resize-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Trash2,
  Maximize,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded-md transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      ImageResize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-colors",
        },
      }),
      Placeholder.configure({
        placeholder: "在此輸入文章內容，可直接貼上圖片或點擊工具列上傳...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-blue max-w-none focus:outline-none min-h-[500px] px-8 py-10 leading-relaxed",
      },
    },
  });

  // Sync content if it changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        editor.chain().focus().setImage({ src: result }).run();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden focus-within:border-blue-500/50 transition-all shadow-2xl">
      {/* Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 p-3 flex flex-wrap gap-1.5 items-center sticky top-0 z-10 shadow-lg">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="大標題"
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="中標題"
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="粗體"
        >
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="斜體"
        >
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="底線"
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="靠左"
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="置中"
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="靠右"
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="項目符號"
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="數字清單"
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="引用區塊"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <div className="w-px h-6 bg-slate-800 mx-1" />

        <MenuButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="插入連結"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>

        <MenuButton onClick={addImage} title="上傳圖片 (可縮放)">
          <ImageIcon className="w-4 h-4" />
        </MenuButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="復原"
          >
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="重做"
          >
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>
      </div>

      {/* Bubble Menu for Images */}
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor }) => editor.isActive("image")}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-xl shadow-2xl"
        >
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="靠左"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="置中"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            title="靠右"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-800 mx-1" />
          <button
            onClick={() => editor.chain().focus().deleteSelection().run()}
            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg transition-colors"
            title="刪除圖片"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <div className="cursor-text bg-slate-950/50 min-h-[500px]">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .prose img {
            cursor: pointer;
            transition: all 0.2s;
          }
          .prose img.ProseMirror-selectednode {
            outline: 3px solid #3b82f6;
            outline-offset: 4px;
          }
        `,
          }}
        />
        <EditorContent editor={editor} />
      </div>

      <div className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
        <div className="flex gap-4">
          <span>{editor.storage.characterCount?.characters?.() || 0} 字元</span>
          <span>{editor.storage.characterCount?.words?.() || 0} 單字</span>
        </div>
        <span className="flex items-center gap-1.5 text-blue-500">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          進階圖文編輯模式
        </span>
      </div>
    </div>
  );
}
