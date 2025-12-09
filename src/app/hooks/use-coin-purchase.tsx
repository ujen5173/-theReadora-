"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentForm } from "~/app/_components/shared/payment/payment-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useUserStore } from "~/store/userStore";
import { MAX_COINS, MIN_COINS } from "~/utils/constants";

export const useCoinPurchase = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>();
  const router = useRouter();

  const user = useUserStore();

  const handleCoinsPurchase = (amount: number) => {
    if (amount < MIN_COINS) {
      toast.error("Minimum purchase amount is 2525 coins");
      return;
    }
    if (amount > MAX_COINS) {
      toast.error(
        `Maximum purchase amount is ${Intl.NumberFormat().format(
          MAX_COINS
        )} coins`
      );
      return;
    }
    if (!user.user) {
      toast.error("Sign in to continue");
      return;
    }
    setSelectedAmount(amount);
    setShowPaymentDialog(true);
  };

  const PurchaseDialog = () => (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedAmount
              ? `Purchase ${selectedAmount.toLocaleString()} Coins`
              : "Purchase Coins"}
          </DialogTitle>
        </DialogHeader>
        <PaymentForm
          type="coins"
          amount={selectedAmount}
          onSuccess={() => {
            setShowPaymentDialog(false);
            router.refresh();
          }}
          onErrorFunc={() => {
            setShowPaymentDialog(false);
            router.push("/auth/signin");
          }}
        />
      </DialogContent>
    </Dialog>
  );

  return {
    handleCoinsPurchase,
    PurchaseDialog,
  };
};
