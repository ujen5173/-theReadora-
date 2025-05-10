"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "~/app/_components/layouts/header";
import { Button } from "~/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment_status");
  const paymentType = searchParams.get("type");

  return (
    <>
      <Header removeBackground />

      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-slate-600 mb-8">
              {paymentType === "subscription"
                ? "Thank you for subscribing to our premium plan. Your account has been upgraded."
                : "Your coins have been added to your account successfully."}
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/settings?tab=coins")}
                className="w-full"
                size="lg"
              >
                Return to Settings
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
