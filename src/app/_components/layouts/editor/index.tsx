"use client";

import { useState } from "react";
import {
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommand,
  EditorContent,
  EditorRoot,
  type EditorInstance,
  EditorCommandList,
} from "novel";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "~/lib/noveh-sh-extensions";
import { slashCommand, suggestionItems } from "./slash-command";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { Separator } from "~/components/ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";

interface EditorProps {
  initialContent?: any;
  onChange?: (content: string, html: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function Editor({
  initialContent,
  onChange,
  placeholder = "Start writing your story...",
  autoFocus = false,
  className = "",
}: EditorProps) {
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      const html = editor.getHTML();

      onChange?.(JSON.stringify(json), html);
    },
    500
  );

  return (
    <div className="relative">
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={[...defaultExtensions, slashCommand]}
          className={`prose prose-lg editor-content dark:prose-invert max-w-none focus:outline-none ${className}`}
          editorProps={{
            attributes: {
              class: "outline-none min-h-[500px] px-4 py-4",
            },
            handleDOMEvents: {
              keydown: (_view, event) => {
                // Required for navigation in slash commands
                if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
                  const slashCommand = document.querySelector("#slash-command");
                  if (slashCommand) {
                    return true;
                  }
                }
                return false;
              },
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
        >
          <EditorCommand className="z-[9000] h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item?.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />

            <Separator orientation="vertical" />
            <TextButtons />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
