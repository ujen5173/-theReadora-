import { FolderExportIcon } from "hugeicons-react";
import { Button } from "~/components/ui/button";

const ExportChapter = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 p-4 shadow-sm">
      <h3 className="font-semibold text-slate-700 flex items-center gap-2">
        <FolderExportIcon className="h-4 w-4 text-primary" />
        Export Story
      </h3>
      <p className="text-sm text-muted-foreground">
        Export your story as a PDF or HTML file.
      </p>
      <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full">
          Export as PDF (.pdf)
        </Button>
        <Button variant="outline" className="w-full">
          Export as Word (.docx)
        </Button>
      </div>
    </div>
  );
};

export default ExportChapter;
