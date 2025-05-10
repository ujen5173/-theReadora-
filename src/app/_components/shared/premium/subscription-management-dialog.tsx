"use client";

import { format } from "date-fns";
import { Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

interface SubscriptionManagementDialogProps {
  subscriptionId: string;
  premiumUntil: Date;
  isYearly: boolean;
  children: React.ReactNode;
}

export const SubscriptionManagementDialog = ({
  subscriptionId,
  premiumUntil,
  isYearly,
  children,
}: SubscriptionManagementDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cancelSubscription = api.payment.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setIsLoading(true);
    try {
      await cancelSubscription.mutateAsync({ subscriptionId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="size-5 text-primary" />
            Manage Subscription
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Current Plan</h4>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {isYearly ? "Yearly Premium" : "Monthly Premium"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active until {format(premiumUntil, "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${isYearly ? "99.99" : "9.99"}/month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isYearly ? "Billed annually" : "Billed monthly"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Benefits</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Ad-free reading experience
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Discounts on premium chapters
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Get 100 monthly coins
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Unlimited Chapters
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Unlimited AI Credits
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleCancelSubscription}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
