'use client';

import { ShieldAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

const DangerZone = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccountMutation = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await signOut();
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
      setIsDeleting(false);
    },
  });

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    deleteAccountMutation.mutate();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-1.5 sm:p-2 rounded-full bg-destructive/10">
            <ShieldAlert className="size-4 sm:size-5 text-destructive" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-destructive">
            Danger Zone
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="space-y-3 sm:space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-white p-3 sm:p-4">
            <h4 className="font-semibold mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
              Permanently delete your account and all associated data. This action
              cannot be undone.
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border border-destructive/20 bg-white p-4">
            <h4 className="font-semibold mb-2">Reset All Settings</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Reset all your preferences and settings to their default values.
            </p>
            <Button variant="outline" className="w-full sm:w-auto">
              Reset Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
