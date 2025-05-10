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
import { MAX_COINS, MIN_COINS } from "~/utils/constants";

export const useCoinPurchase = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>();
  const router = useRouter();

  const handleCoinsPurchase = (amount: number) => {
    if (amount < MIN_COINS) {
      toast.error("Minimum purchase amount is 2525 coins");
      return;
    }
    if (amount > MAX_COINS) {
      toast.error("Maximum purchase amount is 70000 coins");
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
        />
      </DialogContent>
    </Dialog>
  );

  return {
    handleCoinsPurchase,
    PurchaseDialog,
  };
};
