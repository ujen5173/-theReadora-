"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCoinPurchase } from "~/app/hooks/use-coin-purchase";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useUserStore } from "~/store/userStore";
import {
  COIN_PRICE,
  DEFAULT_COIN_AMOUNTS,
  MAX_COINS,
  MIN_COINS,
} from "~/utils/constants";

const CoinsPackage = () => {
  const [coinAmount, setCoinAmount] = useState<number>(DEFAULT_COIN_AMOUNTS[2]);
  const { user } = useUserStore();
  const { handleCoinsPurchase, PurchaseDialog } = useCoinPurchase();

  const calculatePrice = (amount: number) => {
    return (amount * COIN_PRICE).toFixed(2);
  };

  const handleAmountChange = (value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setCoinAmount(numValue);
  };

  return (
    <>
      <div className="flex-1 bg-white hover:shadow-lg p-4 md:p-8 border border-border rounded-lg md:rounded-2xl transition-shadow">
        <h2 className="flex items-center mb-2 font-bold text-slate-800 text-2xl">
          Coins Package
          <Badge variant="outline" className="ml-2">
            Flexible
          </Badge>
        </h2>

        <p className="mb-6 text-slate-600 text-base">
          Purchase coins to unlock premium chapters and support your favorite
          authors.
        </p>

        <div className="space-y-6">
          <div className="gap-4 grid grid-cols-2">
            {DEFAULT_COIN_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                onClick={() => setCoinAmount(amount)}
                className="w-full"
                variant={coinAmount === amount ? "default" : "outline"}
              >
                {new Intl.NumberFormat().format(amount)} Coins
              </Button>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label
                htmlFor="custom-amount"
                className="font-medium text-slate-600 text-sm"
              >
                Custom Amount:
              </Label>
              <span className="font-semibold text-primary/90 text-xs">
                (Max: {new Intl.NumberFormat().format(MAX_COINS)} Coins)
              </span>
            </div>

            <Input
              id="custom-amount"
              value={coinAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              step={100}
              min={MIN_COINS}
              maxLength={5}
              max={MAX_COINS}
              type="number"
              className="mt-1"
            />
          </div>

          <div className="relative">
            <Button
              className="relative w-full"
              // disabled={!user}
              disabled={true}
              size="lg"
              onClick={() => {
                toast.info("Purchasing coins will be rolling out soon.");
                return;
                // handleCoinsPurchase(coinAmount)
              }}
            >
              Buy {coinAmount.toLocaleString()} Coins for $
              {calculatePrice(coinAmount)}/-
            </Button>
            <Badge
              variant={"secondary"}
              className="-top-3 right-2 absolute border border-destructive"
            >
              coming soon
            </Badge>
          </div>

          <p className="text-slate-500 text-xs text-center">
            1 Coin ≈ ${COIN_PRICE}/- • Minimum purchase:{" "}
            {MIN_COINS.toLocaleString()} coins
          </p>
        </div>
      </div>
      <PurchaseDialog />
    </>
  );
};

export default CoinsPackage;
