import { CoinsBitcoinIcon } from "hugeicons-react";
import { Button } from "~/components/ui/button";
import CoinsPackage from "../../shared/premium/coins-package";

const CoinsPackageSettings = () => {
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
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Current Balance</h4>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-primary">1,234</span>
            <span className="text-muted-foreground">coins</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Last updated: Just now</span>
          </div>
        </div>

        <CoinsPackage />
      </div>

      <div className="mt-6 rounded-lg border border-primary/20 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold">Transaction History</h4>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {[
            {
              type: "Purchase",
              amount: "+1,000",
              price: "$9.99",
              time: "2 hours ago",
              status: "completed",
            },
            {
              type: "Chapter Unlock",
              amount: "-50",
              price: "Chapter 15",
              time: "5 hours ago",
              status: "completed",
            },
            {
              type: "Monthly Bonus",
              amount: "+100",
              price: "Premium",
              time: "1 day ago",
              status: "completed",
            },
          ].map((transaction, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.amount.startsWith("+")
                      ? "bg-green-100 text-green-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  <CoinsBitcoinIcon className="size-4" />
                </div>
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    transaction.amount.startsWith("+")
                      ? "text-green-600"
                      : "text-destructive"
                  }`}
                >
                  {transaction.amount}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinsPackageSettings;
