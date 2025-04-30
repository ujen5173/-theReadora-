import { CheckCircle2, Crown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sparkles } from "lucide-react";

const PremiumBanner = () => {
  const premiumFeatures = [
    "Ad-free reading experience",
    "Discounts on premium chapters",
    "Get 100 monthly coins",
    "Unlimited Chapters",
    "Unlimited AI Credits",
    "Advanced Writing Tools",
  ];

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
          {premiumFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-700">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button icon={Crown} className="w-full" variant="default">
          Subscribe – $9.99/-
        </Button>
      </div>
    </div>
  );
};

export default PremiumBanner;
