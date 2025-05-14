import { CreditCard } from "lucide-react";

const BillingSection = () => {
  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20">
          <CreditCard className="size-4 sm:size-5 text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-primary">
          Billing & Subscription
        </h3>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Add your billing content here */}
      </div>
    </div>
  );
};

export default BillingSection;
