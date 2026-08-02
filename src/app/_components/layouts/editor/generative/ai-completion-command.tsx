import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "~/components/ui/command";
import { useEditor } from "novel";
import { Delete02Icon, QuoteDownIcon, Tick02Icon } from "hugeicons-react";

const AICompletionCommands = ({
  completion,
  onDiscard,
}: {
  completion: string;
  onDiscard: () => void;
}) => {
  const { editor } = useEditor();
  return (
    <>
      <CommandGroup>
        <CommandItem
          className="gap-2 px-4"
          value="replace"
          onSelect={() => {
            if (editor) {
              const selection = editor.view.state.selection;

              editor
                .chain()
                .focus()
                .insertContentAt(
                  {
                    from: selection.from,
                    to: selection.to,
                  },
                  completion,
                )
                .run();
            }
          }}
        >
          <Tick02Icon className="h-4 w-4 text-muted-foreground" />
          Replace selection
        </CommandItem>
        <CommandItem
          className="gap-2 px-4"
          value="insert"
          onSelect={() => {
            if (editor) {
              const selection = editor.view.state.selection;
              editor
                .chain()
                .focus()
                .insertContentAt(selection.to + 1, completion)
                .run();
            }
          }}
        >
          <QuoteDownIcon className="h-4 w-4 text-muted-foreground" />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value="thrash" className="gap-2 px-4">
          <Delete02Icon className="h-4 w-4 text-muted-foreground" />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AICompletionCommands;
