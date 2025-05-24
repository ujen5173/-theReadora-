"use client";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  type EditorInstance,
} from "novel";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "~/components/ui/separator";
import { defaultExtensions } from "~/lib/noveh-sh-extensions";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

interface EditorProps {
  initialContent?: any;
  onChange?: (content: string, html: string) => void;
  className?: string;
}

export function Editor({
  initialContent,
  onChange,
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
          className={`prose prose-lg editor-content max-w-none focus:outline-none ${className}`}
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
