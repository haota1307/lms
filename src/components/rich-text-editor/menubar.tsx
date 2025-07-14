"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
} from "lucide-react";

interface MenubarProps {
  editor: Editor | null;
}

const Menubar = ({ editor }: MenubarProps) => {
  const [_, setIsUpdated] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      setIsUpdated((prev) => prev + 1);
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("transaction", handleUpdate);

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-b dark:bg-input p-2 bg-background">
      <TooltipProvider>
        <div className="flex items-center gap-x-2 flex-wrap">
          {/* Bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editor.isActive("bold") && "bg-accent text-accent-foreground"
                )}
              >
                <Bold className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>In đậm</TooltipContent>
          </Tooltip>

          {/* Italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editor.isActive("italic") &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Italic className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>In nghiêng</TooltipContent>
          </Tooltip>

          {/* Underline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("underline")}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                className={cn(
                  editor.isActive("underline") &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Underline className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Gạch chân</TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Heading */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Heading1 className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Tiêu đề 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Heading2 className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Tiêu đề 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Heading3 className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Tiêu đề 3</TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editor.isActive("bulletList") &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Danh sách đầu dòng</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editor.isActive("orderedList") &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <ListOrdered className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Danh sách đánh số</TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Align */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "left" }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <AlignLeft className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Căn trái</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "center" }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <AlignCenter className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Căn giữa</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "right" }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <AlignRight className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Căn phải</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: "justify" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                className={cn(
                  editor.isActive({ textAlign: "justify" }) &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <AlignJustify className="w-4 h-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Căn đều</TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-border mx-1" />

          {/* Undo / Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hoàn tác</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Làm lại</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Menubar;
