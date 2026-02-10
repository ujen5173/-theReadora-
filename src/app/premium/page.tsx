"use client";

import { format } from "date-fns";
import { ZapIcon } from "hugeicons-react";
import { CheckIcon, Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { premiumFeatures } from "~/utils/site";
import Header from "../_components/layouts/header";
import CoinsPackage from "../_components/shared/premium/coins-package";

const Premium = () => {
  const uniquePremiumFeatures = [...new Set(premiumFeatures.benefits)];
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
    toast.info("Subscription feature will be rolling out soon.");
    return;
    // if (userData) {
    //   createSubscription({
    //     priceId: isYearly
    //       ? "price_1RMoywL5ATfigxyFKcLRvctl"
    //       : "price_1RMYWtL5ATfigxyFpgyaO8or",
    //     isYearly,
    //   });
    // } else {
    //   toast.error("Login to subscribe and enjoy perks");
    // }
  };

  return (
    <>
      <Header
        background={false}
        removeBackground
        headerExtraStyle="border-b border-border"
      />

      <main className="bg-slate-100 p-4 w-full min-h-screen">
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="flex flex-col justify-center items-center mx-auto px-4 py-12 sm:py-28 container">
            <Badge
              variant={"outline"}
              className="hover:bg-primary/10 mb-4 border-primary h-7 text-primary transition-colors"
            >
              <ZapIcon className="mr-1 w-4 h-4" />
              Pricing Plan
            </Badge>

            <h1 className="mb-4 font-bold text-slate-700 text-4xl lg:text-5xl text-center">
              Simple, Flexible Pricing
            </h1>

            <p className="mx-auto mb-12 lg:w-3/5 text-slate-600 text-lg text-center text-balance">
              Choose the perfect plan for your reading journey. Join thousands
              of happy readers who have already upgraded their experience.
            </p>

            <div className="bg-destructive/30 mb-4 p-4 border border-destructive rounded-md font-semibold text-slate-700">
              Subscription and coin purchase will roll out soon.
            </div>

            {userData?.balance?.premium && (
              <div className="mb-8 w-full max-w-5xl">
                <div className="flex justify-between items-center bg-gradient-to-r from-primary/5 to-primary/10 p-6 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Crown className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        Premium Status Active
                      </p>
                      <p className="text-muted-foreground text-sm">
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

            <div className="flex items-center space-x-4 bg-slate-100 mb-8 p-2 rounded-full">
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
                <span className="ml-1 font-medium text-primary text-xs">
                  Save 20%
                </span>
              </Label>
            </div>

            <div className="gap-8 grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
              <div className="flex-1 bg-primary shadow-lg p-4 md:p-8 border border-primary rounded-lg md:rounded-2xl">
                <div className="flex flex-col h-full">
                  <h2 className="flex items-center mb-4 font-bold text-white text-2xl">
                    Premium Plan
                    <Badge variant="secondary" className="ml-2">
                      Most Popular
                    </Badge>
                  </h2>

                  <div className="space-y-4 mb-8">
                    {uniquePremiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="bg-white/20 p-1 rounded-full">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                        <p className="font-medium text-white">{feature}</p>
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
                        <span className="font-bold text-white text-3xl">
                          $
                          {isYearly
                            ? STRIPE_YEARLY_PLAN_PRICE
                            : STRIPE_MONTHLY_PLAN_PRICE}
                        </span>
                        <span className="ml-1 text-white/80">
                          /{isYearly ? "year" : "month"}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Button
                        className="relative bg-white hover:bg-white/90 w-full text-primary"
                        variant="secondary"
                        size="lg"
                        onClick={handleSubscribe}
                        disabled={
                          true
                          // status === "pending" || userData?.balance?.premium
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
                      <Badge
                        variant={"secondary"}
                        className="-top-3 right-2 absolute border border-destructive"
                      >
                        coming soon
                      </Badge>
                    </div>
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
