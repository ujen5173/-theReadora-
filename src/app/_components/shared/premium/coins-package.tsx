"use client";

import { useState } from "react";
import { useCoinPurchase } from "~/app/hooks/use-coin-purchase";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  COIN_PRICE,
  DEFAULT_COIN_AMOUNTS,
  MAX_COINS,
  MIN_COINS,
} from "~/utils/constants";

const CoinsPackage = () => {
  const [coinAmount, setCoinAmount] = useState<number>(DEFAULT_COIN_AMOUNTS[2]);
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
      <div className="flex-1 border border-border bg-white rounded-lg md:rounded-2xl p-4 md:p-8 hover:shadow-lg transition-shadow">
        <h2 className="mb-2 text-2xl font-bold text-slate-800 flex items-center">
          Coins Package
          <Badge variant="outline" className="ml-2">
            Flexible
          </Badge>
        </h2>

        <p className="text-slate-600 text-base mb-6">
          Purchase coins to unlock premium chapters and support your favorite
          authors.
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="custom-amount"
                className="text-sm font-medium text-slate-600"
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

          <Button
            className="w-full"
            size="lg"
            onClick={() => handleCoinsPurchase(coinAmount)}
          >
            Buy {coinAmount.toLocaleString()} Coins for $
            {calculatePrice(coinAmount)}/-
          </Button>

          <p className="text-xs text-slate-500 text-center">
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
