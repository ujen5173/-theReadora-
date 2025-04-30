"use client";

import Header from "../_components/layouts/header";
import { ZapIcon } from "hugeicons-react";
import { CheckIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useState } from "react";

const Premium = () => {
  const premiumFeatures = [
    "Ad-free reading experience",
    "Discounts on premium chapters",
    "Get 100 monthly coins",
    "Unlimited Chapters",
    "Unlimited AI Credits",
    "Advanced Writing Tools",
  ];

  const uniquePremiumFeatures = [...new Set(premiumFeatures)];

  const [isYearly, setIsYearly] = useState(false);
  const [coinAmount, setCoinAmount] = useState(5000);

  const calculatePrice = (amount: number) => {
    return ((amount / 500) * 0.99).toFixed(2);
  };

  return (
    <>
      <Header
        background={false}
        removeBackground
        headerExtraStyle="border-b border-border"
      />
      <main className="w-full min-h-screen bg-slate-100 border-b border-border p-4">
        <div className="rounded-lg bg-white border border-slate-200">
          <div className="container mx-auto px-4 flex items-center justify-center py-28 flex-col">
            <Badge
              variant={"outline"}
              className="h-7 border-primary text-primary mb-4 hover:bg-primary/10 transition-colors"
            >
              <ZapIcon className="h-4 w-4 mr-1" />
              Pricing Plan
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-4 text-center">
              Simple, Flexible Pricing
            </h1>

            <p className="text-lg text-slate-600 mb-12 text-balance mx-auto lg:w-3/5 text-center">
              Choose the perfect plan for your reading journey. Join thousands
              of happy readers who have already upgraded their experience.
            </p>

            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-full">
                <Label
                  htmlFor="yearly"
                  className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                    !isYearly ? "bg-white shadow-sm" : ""
                  }`}
                >
                  Monthly
                </Label>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  value="yearly"
                  id="yearly"
                />
                <Label
                  htmlFor="yearly"
                  className={`cursor-pointer px-4 py-2 rounded-full transition-colors ${
                    isYearly ? "bg-white shadow-sm" : ""
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-xs text-primary font-medium">
                    Save 20%
                  </span>
                </Label>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full max-w-6xl">
              <div className="flex-1 border border-primary bg-primary rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col h-full">
                  <h2 className="mb-4 text-2xl font-bold text-white flex items-center">
                    Premium Plan
                    <Badge variant="secondary" className="ml-2">
                      Most Popular
                    </Badge>
                  </h2>

                  <div className="space-y-4 mb-8">
                    {uniquePremiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="rounded-full bg-white/20 p-1">
                          <CheckIcon className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-white font-medium">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <p className="text-white/90 mb-4 text-sm">
                      {isYearly
                        ? "Billed annually for better savings"
                        : "Billed monthly, cancel anytime"}
                    </p>
                    <Button
                      className="w-full bg-white text-primary hover:bg-white/90"
                      variant="secondary"
                      size="lg"
                    >
                      Subscribe – ${isYearly ? "95.88/year" : "9.99/month"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 border border-border bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <h2 className="mb-2 text-2xl font-bold text-slate-800 flex items-center">
                  Coins Package
                  <Badge variant="outline" className="ml-2">
                    Flexible
                  </Badge>
                </h2>

                <p className="text-slate-600 text-base mb-6">
                  Purchase coins to unlock premium chapters and support your
                  favorite authors.
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
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Premium;
