import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useNewChapterStore } from "~/store/useNewChapter";

interface NewChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewChapterDialog = ({ open, onOpenChange }: NewChapterDialogProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { hardSaved, setHardSaved } = useNewChapterStore();

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      // If chapter isn't saved, save it as draft first
      if (!hardSaved) {
        // Add your save draft logic here
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated save
        setHardSaved(true);
      }

      // Reset the store and redirect to new chapter
      router.push("/write/story/new-chapter");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create new chapter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex gap-2 items-center">
            <div className="size-10 rounded-full bg-amber-100 border border-amber-200   flex items-center justify-center">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Create New Chapter</DialogTitle>
              <DialogDescription className="mt-1.5">
                Start writing your next chapter
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-amber-600  flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-amber-900">
                  Unsaved Changes Warning
                </p>
                <p className="text-sm text-amber-700">
                  Your current chapter has unsaved changes. Creating a new
                  chapter will automatically save the current one as a draft.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 ">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90"
          >
            {isLoading && <Loader2 className="size-4 animate-spin mr-2" />}
            {hardSaved ? "Create New Chapter" : "Save and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewChapterDialog;
