import { format } from "date-fns";
import { CoinsBitcoinIcon } from "hugeicons-react";
import { ArrowRight, Crown, Lock } from "lucide-react";
import Link from "next/link";
import { SubscriptionManagementDialog } from "~/app/_components/shared/premium/subscription-management-dialog";
import CrownMinus from "~/assets/svgs/crown-minus";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/server";
import CoinsPackage from "../../shared/premium/coins-package";

const CoinsPackageSettings = async () => {
  const data = await api.user.getPurchasesDetails();

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
          <CoinsBitcoinIcon className="size-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-primary">Coins Management</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <div className="pb-6 border-b border-border border-dashed">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Current Balance</h4>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-primary">
                {new Intl.NumberFormat().format(data.balance?.coins ?? 0)}
              </span>
              <span className="text-muted-foreground">coins</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>
                Last updated:{" "}
                <span className="italic font-semibold">
                  {data.balance?.coinsLastUpdated
                    ? format(
                        data.balance?.coinsLastUpdated,
                        "MMM d, yyyy h:mm a"
                      )
                    : "Just Now"}
                </span>
              </span>
            </div>
          </div>
          <div className="pt-6">
            <h4 className="font-semibold mb-4">Premium Membership</h4>
            <div className="space-y-4">
              {data.balance?.premium ? (
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Crown className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Premium Status</p>
                      <p className="text-sm text-muted-foreground">
                        Active until{" "}
                        {data.balance?.premiumUntil
                          ? format(data.balance?.premiumUntil, "MMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <SubscriptionManagementDialog
                    subscriptionId={data.balance.purchaseId ?? ""}
                    premiumUntil={data.balance.premiumUntil ?? new Date()}
                    isYearly={
                      data.balance.purchaseId?.includes("yearly") ?? false
                    }
                  >
                    <Button
                      variant="outline"
                      icon={ArrowRight}
                      iconPlacement="right"
                      size="sm"
                    >
                      Manage
                    </Button>
                  </SubscriptionManagementDialog>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Lock className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Unlock Premium Features</p>
                      <p className="text-sm text-muted-foreground">
                        Get exclusive benefits and more coins
                      </p>
                    </div>
                  </div>

                  <Link href={"/premium"}>
                    <Button
                      icon={ArrowRight}
                      iconPlacement="right"
                      effect={"expandIcon"}
                      className="w-full"
                    >
                      Explore Premium
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <CoinsPackage />
      </div>

      <div className="mt-6 rounded-lg border border-primary/20 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold">Transaction History</h4>
        </div>
        <ScrollArea className="h-[450px]">
          <div className="space-y-4 pr-4">
            {data?.purchases.length === 0 && (
              <div className="py-10">
                <p className="text-center text-muted-foreground">
                  No transactions found
                </p>
              </div>
            )}
            {data?.purchases.map((transaction, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "PURCHASE" ||
                      transaction.type === "MONTHLY_BONUS" ||
                      transaction.type === "REFERRAL_BONUS" ||
                      transaction.type === "SUBSCRIPTION"
                        ? "bg-green-100 text-green-600"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {transaction.type === "SUBSCRIPTION_ENDED" ? (
                      <CrownMinus className="stroke-rose-700 size-4" />
                    ) : transaction.type === "SUBSCRIPTION" ? (
                      <Crown className="size-4" />
                    ) : (
                      <CoinsBitcoinIcon className="size-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.type === "PURCHASE" && "Coins Purchase"}
                      {transaction.type === "CHAPTER_UNLOCK" &&
                        "Chapter Unlock"}
                      {transaction.type === "MONTHLY_BONUS" && "Monthly Bonus"}
                      {transaction.type === "REFERRAL_BONUS" &&
                        "Referral Bonus"}
                      {transaction.type === "SUBSCRIPTION" &&
                        "Premium Subscription"}
                      {transaction.type === "SUBSCRIPTION_ENDED" &&
                        "Subscription Ended"}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {format(
                          new Date(transaction.time),
                          "MMM d, yyyy h:mm a"
                        )}
                      </span>
                      {(transaction.type === "PURCHASE" ||
                        transaction.type === "SUBSCRIPTION") && <span>•</span>}
                      {transaction.type === "PURCHASE" && (
                        <span>${transaction.price}</span>
                      )}
                      {transaction.type === "SUBSCRIPTION" && (
                        <span>${transaction.price}/month</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {transaction.type === "PURCHASE" && (
                    <p className="font-medium text-green-600">
                      +{transaction.amount.toLocaleString()} coins
                    </p>
                  )}
                  {transaction.type === "SUBSCRIPTION" && (
                    <p className="font-medium text-green-600">
                      Premium Activated
                    </p>
                  )}
                  {transaction.type === "MONTHLY_BONUS" && (
                    <p className="font-medium text-green-600">
                      +{transaction.amount.toLocaleString()} coins
                    </p>
                  )}
                  {transaction.type === "REFERRAL_BONUS" && (
                    <p className="font-medium text-green-600">
                      +{transaction.amount.toLocaleString()} coins
                    </p>
                  )}
                  {transaction.type === "CHAPTER_UNLOCK" && (
                    <p className="font-medium text-destructive">
                      -{transaction.amount.toLocaleString()} coins
                    </p>
                  )}
                  {transaction.type === "SUBSCRIPTION_ENDED" && (
                    <p className="font-medium text-destructive">
                      Cancelled / Ended
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CoinsPackageSettings;
