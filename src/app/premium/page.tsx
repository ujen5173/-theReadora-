"use client";

import { format } from "date-fns";
import { ZapIcon } from "hugeicons-react";
import { CheckIcon, Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { SubscriptionManagementDialog } from "~/app/_components/shared/premium/subscription-management-dialog";
import { useCoinPurchase } from "~/app/hooks/use-coin-purchase";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import {
  STRIPE_MONTHLY_PLAN_PRICE,
  STRIPE_YEARLY_PLAN_PRICE,
} from "~/utils/constants";
import { generateSEOMetadata } from "~/utils/site";
import Header from "../_components/layouts/header";
import CoinsPackage from "../_components/shared/premium/coins-package";

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
  const { PurchaseDialog } = useCoinPurchase();

  const { data: userData } = api.user.getPurchasesDetails.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { mutateAsync: createSubscription, status } =
    api.payment.createSubscription.useMutation({
      onSuccess: (data) => {
        if (data.clientSecret) {
          window.location.href = `/payment?client_secret=${data.clientSecret}`;
        }
      },
      onError: (error) => {
        console.error("Failed to create subscription:", error);
      },
    });

  const handleSubscribe = () => {
    createSubscription({
      priceId: isYearly
        ? "price_1RMoywL5ATfigxyFKcLRvctl"
        : "price_1RMYWtL5ATfigxyFpgyaO8or",
      isYearly,
    });
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

            {userData?.balance?.premium && (
              <div className="w-full max-w-5xl mb-8">
                <div className="flex items-center justify-between p-6 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Crown className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        Premium Status Active
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your premium subscription is active until{" "}
                        {userData.balance.premiumUntil
                          ? format(userData.balance.premiumUntil, "MMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <SubscriptionManagementDialog
                    subscriptionId={userData.balance.purchaseId ?? ""}
                    premiumUntil={userData.balance.premiumUntil ?? new Date()}
                    isYearly={
                      userData.balance.purchaseId?.includes("yearly") ?? false
                    }
                  >
                    <Button variant="outline" size="lg">
                      Manage Subscription
                    </Button>
                  </SubscriptionManagementDialog>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 bg-slate-100 p-2 rounded-full mb-8">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
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
                    <div className="mb-4">
                      <p className="text-white/90 text-sm">
                        {isYearly
                          ? "Billed annually for better savings"
                          : "Billed monthly, cancel anytime"}
                      </p>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-white">
                          $
                          {isYearly
                            ? STRIPE_YEARLY_PLAN_PRICE
                            : STRIPE_MONTHLY_PLAN_PRICE}
                        </span>
                        <span className="text-white/80 ml-1">
                          /{isYearly ? "year" : "month"}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-white text-primary hover:bg-white/90"
                      variant="secondary"
                      size="lg"
                      onClick={handleSubscribe}
                      disabled={
                        status === "pending" || userData?.balance?.premium
                      }
                    >
                      {status === "pending" ? (
                        <Loader2 className="animate-spin" />
                      ) : userData?.balance?.premium ? (
                        "Current Plan"
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <CoinsPackage />
            </div>
          </div>
        </div>
      </main>
      <PurchaseDialog />
    </>
  );
};

export default Premium;

export const metadata = generateSEOMetadata({
  title: "Readora Premium - Enhanced Reading Experience",
  description:
    "Upgrade to Readora Premium for an ad-free experience, exclusive content, offline reading, and more. Start your premium journey today!",
  pathname: "/premium",
  keywords: [
    "premium",
    "subscription",
    "premium features",
    "ad-free reading",
    "exclusive content",
  ],
});
