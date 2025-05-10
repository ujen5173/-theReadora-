"use client";
import { Lock, Unlock } from "lucide-react";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { useNewChapterStore } from "~/store/useNewChapter";
import { CHAPTER_PRICE_POOL } from "~/utils/constants";

const PremiumChapter = () => {
  const { isLocked, setIsLocked, price, setPrice } = useNewChapterStore();

  const priceDescriptions = {
    POOL_50: "Short - Medium Chapter (50 coins ≈ $0.50)",
    POOL_70: "Medium - Long Chapter (70 coins ≈ $0.69)",
    POOL_110: "Long - Very Long Chapter (110 coins ≈ $1.09)",
    POOL_150: "Premium Author Chapter (150 coins ≈ $1.49)",
  };

  return (
    <div className="bg-white rounded-xl border border-border dark:border-slate-700/50 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center text-slate-700 gap-2">
          {isLocked ? (
            <Lock className="h-4 w-4 text-primary" />
          ) : (
            <Unlock className="h-4 w-4 text-primary" />
          )}
          Premium Chapter
        </h3>
        <Switch
          checked={isLocked}
          onCheckedChange={(e) => {
            setIsLocked(e);
            if (!e) {
              setPrice(null);
            }
          }}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {isLocked && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-slate-600">Chapter Price</Label>
            <Select
              value={price ?? undefined}
              onValueChange={(value) =>
                setPrice(value as keyof typeof CHAPTER_PRICE_POOL)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select price" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHAPTER_PRICE_POOL).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {priceDescriptions[key as keyof typeof priceDescriptions]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium mb-1">Price Information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Readers will need to pay{" "}
                {priceDescriptions[price as keyof typeof priceDescriptions]}{" "}
                coins to unlock this chapter
              </li>
              <li>Premium members get a 20% discount on chapter prices</li>
              <li>You'll receive 70% of the revenue from chapter purchases</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumChapter;
