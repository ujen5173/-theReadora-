import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { api } from "~/trpc/react";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  type: "subscription" | "coins";
  priceId?: string;
  isYearly?: boolean;
  amount?: number;
  onSuccess?: () => void;
  clientSecret?: string;
}

const PaymentFormContent = ({
  type,
  onSuccess,
}: {
  type: "subscription" | "coins";
  onSuccess?: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?payment_status=succeeded&type=${type}`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        toast.error(error.message ?? "Payment failed");
      } else if (paymentIntent) {
        console.log("Payment intent status:", paymentIntent.status);
        if (paymentIntent.status === "succeeded") {
          toast.success("Payment successful!");
          onSuccess?.();
          router.push(`/payment/success?payment_status=succeeded&type=${type}`);
        } else if (paymentIntent.status === "requires_action") {
          // Handle 3D Secure authentication
          const { error: actionError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/payment/success?payment_status=succeeded&type=${type}`,
            },
          });

          if (actionError) {
            console.error("3D Secure error:", actionError);
            toast.error(actionError.message ?? "Payment failed");
          }
        }
      }
    } catch (error) {
      console.error("Payment exception:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <PaymentElement
        onReady={() => {
          setIsPaymentElementReady(true);
        }}
      />
      <Button
        type="submit"
        disabled={!stripe || isLoading || !isPaymentElementReady}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export const PaymentForm = ({
  type,
  amount,
  onSuccess,
  clientSecret: initialClientSecret,
}: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    initialClientSecret
  );

  const createCoinsPayment = api.payment.createCoinsPayment.useMutation({
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        toast.error("Failed to get payment details");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (type === "coins" && amount && !clientSecret) {
      createCoinsPayment.mutate({ amount });
    }
  }, [type, amount, clientSecret]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0ea5e9",
          },
        },
      }}
    >
      <PaymentFormContent type={type} onSuccess={onSuccess} />
    </Elements>
  );
};
