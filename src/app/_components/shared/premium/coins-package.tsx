"use client";

import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const CoinsPackage = () => {
  const [coinAmount, setCoinAmount] = useState(5000);

  const calculatePrice = (amount: number) => {
    return ((amount / 500) * 0.99).toFixed(2);
  };

  return (
    <div className="flex-1 border border-border bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
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
          {[1000, 2500, 5000, 10_000].map((amount) => (
            <Button
              key={amount}
              variant={coinAmount === amount ? "default" : "outline"}
              onClick={() => setCoinAmount(amount)}
              className="w-full"
            >
              {amount.toLocaleString()} Coins
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
              (Max: 100,000 Coins)
            </span>
          </div>
          <Input
            id="custom-amount"
            value={coinAmount}
            onChange={(e) =>
              setCoinAmount(
                Number(e.target.value) < 100_000
                  ? Number(e.target.value)
                  : 100_000
              )
            }
            placeholder="Enter amount"
            step={500}
            min={500}
            max={100_000}
            type="number"
            className="mt-1"
          />
        </div>

        <Button className="w-full" size="lg">
          Buy {coinAmount.toLocaleString()} Coins for $
          {calculatePrice(coinAmount)}/-
        </Button>

        <p className="text-xs text-slate-500 text-center">
          1 Coin ≈ $0.002/- • Minimum purchase: 500 coins
        </p>
      </div>
    </div>
  );
};

export default CoinsPackage;
