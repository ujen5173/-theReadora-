import { ShieldAlert } from "lucide-react";
import { Button } from "~/components/ui/button";

const DangerZone = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-destructive/10">
            <ShieldAlert className="size-5 text-destructive" />
          </div>
          <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-destructive/20 bg-white p-4">
            <h4 className="font-semibold mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <Button variant="destructive" className="w-full sm:w-auto">
              Delete Account
            </Button>
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
