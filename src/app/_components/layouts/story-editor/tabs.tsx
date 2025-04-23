import { Focus, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useNewChapterStore } from "~/store/useNewChapter";

const StoryEditorTabs = () => {
  const { focusMode, setFocusMode } = useNewChapterStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1">
        <TabsTrigger
          value="write"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Write
        </TabsTrigger>
        <TabsTrigger
          value="preview"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Preview
        </TabsTrigger>
        {/* <TabsTrigger
          value="notes"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
        >
          Notes
        </TabsTrigger> */}
      </TabsList>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setFocusMode(!focusMode)}
          effect={"shineHover"}
          icon={Focus}
          size="sm"
        >
          {focusMode ? "Comfort Mode" : "Focus Mode"}
        </Button>
        {/* <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
          icon={Goal}
        >
          Set Goal
        </Button> */}
        <Button
          size="sm"
          className="bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90"
          icon={Sparkles}
        >
          AI Assistant
        </Button>
      </div>
    </div>
  );
};

export default StoryEditorTabs;
