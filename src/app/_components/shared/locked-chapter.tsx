"use client";

import { Coins, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { env } from "~/env";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import { CHAPTER_PRICE_POOL } from "~/utils/constants";

interface LockedChapterProps {
  chapterId: string;
  price: keyof typeof CHAPTER_PRICE_POOL | null;
  title: string;
  chapterNumber: number;
}

const LockedChapter = ({
  chapterId,
  price,
  title,
  chapterNumber,
}: LockedChapterProps) => {
  const { user } = useUserStore();
  const router = useRouter();

  return (
    <div className="w-full min-h-[500px] flex items-center justify-center bg-slate-50 border border-border rounded-lg">
      <div className="max-w-md w-full p-8 text-center space-y-6">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Chapter Info */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-800">
            Chapter {chapterNumber}
          </h2>
          <p className="text-slate-600">{title}</p>
        </div>

        {/* Price Info */}
        <div className="flex items-center justify-center gap-2 text-slate-700">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {CHAPTER_PRICE_POOL[price as keyof typeof CHAPTER_PRICE_POOL]} coins
          </span>
        </div>

        {/* Unlock Button */}
        <UnlockButton
          price={price as keyof typeof CHAPTER_PRICE_POOL}
          chapterId={chapterId}
        >
          <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
            <Coins className="h-4 w-4" />
            Unlock Chapter
          </Button>
        </UnlockButton>

        {/* Premium Info */}
        {user?.premium && (
          <p className="text-sm text-slate-500">
            Premium members get 20% off! (
            {Math.floor(
              CHAPTER_PRICE_POOL[price as keyof typeof CHAPTER_PRICE_POOL] * 0.8
            )}{" "}
            coins)
          </p>
        )}

        {/* Additional Info */}
        <div className="text-sm text-slate-500 space-y-1">
          <p>
            You can unlock this chapter by paying{" "}
            {CHAPTER_PRICE_POOL[price as keyof typeof CHAPTER_PRICE_POOL]} coins
          </p>
          <p>Support the author by unlocking this chapter</p>
        </div>
      </div>
    </div>
  );
};

export default LockedChapter;

const UnlockButton = ({
  children,
  price,
  chapterId,
}: {
  children: React.ReactNode;
  price: keyof typeof CHAPTER_PRICE_POOL;
  chapterId: string;
}) => {
  const { user } = useUserStore();
  const router = useRouter();
  const { mutate: unlockChapter, status } = api.chapter.unlock.useMutation({
    onSuccess: () => {
      toast.success("Chapter unlocked successfully!");
      window.location.reload();
    },
  });

  const handleUnlock = () => {
    if (!user) {
      router.push(
        `/auth/signin?callbackUrl=${env.NEXT_PUBLIC_APP_URL}/chapter/${chapterId}`
      );
      return;
    }

    unlockChapter({ chapterId });
  };

  const basePrice = CHAPTER_PRICE_POOL[price];
  const discountedPrice = user?.premium
    ? Math.floor(basePrice * 0.8)
    : basePrice;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary/90 to-primary px-4 py-6 md:p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Unlock Chapter
            </DialogTitle>
            <DialogDescription className="text-white/90 md:mt-2">
              Confirm your purchase to unlock this chapter
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 md:p-8">
          {/* Price Breakdown */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 md:pb-4">
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-bold text-slate-700">Base Price</span>
                  <p className="text-sm text-slate-500">
                    Standard chapter price
                  </p>
                </div>
              </div>
              <span className="font-semibold text-slate-900">
                {basePrice} coins
              </span>
            </div>

            {user?.premium && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 md:pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-green-600 font-semibold">20%</div>
                  <div>
                    <span className="font-bold text-green-700">
                      Premium Discount
                    </span>
                    <p className="text-sm text-green-600">
                      Exclusive member benefit
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">
                  -{basePrice - discountedPrice} coins
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3 md:pb-4">
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-bold text-slate-700">Your Balance</span>
                  <p className="text-sm text-slate-500">Available coins</p>
                </div>
              </div>
              <span className="font-semibold text-slate-900">
                {user?.coins ?? 0} coins
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-bold text-slate-700">Final Price</span>
                  <p className="text-sm text-slate-500">
                    Amount to be deducted
                  </p>
                </div>
              </div>
              <span className="font-bold text-primary text-lg">
                {discountedPrice} coins
              </span>
            </div>

            {/* Insufficient Balance Warning */}
            {user && (user.coins ?? 0) < discountedPrice && (
              <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
                <span>⚠️</span>
                <p>
                  Insufficient balance. Please add more coins to unlock this
                  chapter.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-3 md:p-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-12">
              Cancel
            </Button>
            <Button
              onClick={handleUnlock}
              disabled={
                status === "pending" ||
                (user?.coins ? user.coins < discountedPrice : false)
              }
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
            >
              {status === "pending" ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : user ? (
                <>
                  <Coins className="h-5 w-5 mr-2" />
                  Unlock Chapter
                </>
              ) : (
                "Sign in to Unlock"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
