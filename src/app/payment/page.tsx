"use client";

import { useSearchParams } from "next/navigation";
import { PaymentForm } from "~/app/_components/shared/payment/payment-form";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("client_secret");

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Invalid Payment Session
          </h1>
          <p className="text-slate-600">
            The payment session is invalid or has expired. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-slate-600">
            Please enter your payment details to complete your subscription.
          </p>
        </div>
        <PaymentForm type="subscription" clientSecret={clientSecret} />
      </div>
    </div>
  );
}
