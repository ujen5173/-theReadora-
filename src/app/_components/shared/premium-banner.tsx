"use client";

import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useUserStore } from "~/store/userStore";
import { STRIPE_MONTHLY_PLAN_PRICE } from "~/utils/constants";
import { premiumFeatures } from "~/utils/site";

const PremiumBanner = () => {
  const { user, isLoading } = useUserStore();

  if (user?.premium || isLoading) return null;

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/10"></div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="size-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Upgrade to Premium
          </h3>
        </div>

        <ul className="space-y-2 mb-4">
          {premiumFeatures.benefits.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Link href="/premium" className="w-full">
          <Button icon={Crown} className="w-full" variant="default">
            Subscribe – ${STRIPE_MONTHLY_PLAN_PRICE}/-
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PremiumBanner;
