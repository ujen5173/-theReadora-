import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { postgresDb } from "~/server/postgresql";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  console.log("Webhook received:", {
    signature: signature ? "present" : "missing",
    bodyLength: body.length,
  });

  if (!signature) {
    console.error("No signature found in webhook request");
    return new NextResponse("No signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Webhook event type:", event.type);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        console.log("Subscription updated:", {
          subscriptionId: subscription.id,
          userId,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });

        if (!userId) {
          throw new Error("No user ID found in subscription metadata");
        }

        try {
          // Handle different subscription statuses
          switch (subscription.status) {
            case "active": {
              // Update user's premium status
              await postgresDb.user.update({
                where: { id: userId },
                data: {
                  premium: true,
                  premiumUntil: new Date(
                    (subscription as any).current_period_end * 1000
                  ),
                  premiumSince: new Date(),
                  premiumPurchasedAt: new Date(),
                  purchaseMedium: "STRIPE",
                  purchaseId: subscription.id,
                },
              });
              break;
            }
            case "canceled": {
              // Subscription was canceled immediately
              await postgresDb.user.update({
                where: { id: userId },
                data: {
                  premium: false,
                  premiumUntil: null,
                  premiumSince: null,
                  premiumPurchasedAt: null,
                  purchaseMedium: null,
                  purchaseId: null,
                },
              });

              // Record the cancellation
              await postgresDb.transactions.create({
                data: {
                  userId,
                  type: "SUBSCRIPTION_ENDED",
                  amount: 0,
                  price: "0",
                  time: new Date().toISOString(),
                  status: "completed",
                  pre_transaction_coins: 0,
                  post_transaction_coins: 0,
                  metadata: {
                    subscriptionId: subscription.id,
                    cancelledAt: new Date().toISOString(),
                  },
                },
              });
              break;
            }
            case "incomplete": {
              // Subscription is incomplete (payment failed)
              await postgresDb.user.update({
                where: { id: userId },
                data: {
                  premium: false,
                  premiumUntil: null,
                  premiumSince: null,
                  premiumPurchasedAt: null,
                  purchaseMedium: null,
                  purchaseId: null,
                },
              });
              break;
            }
          }

          // If subscription is marked for cancellation at period end
          if (subscription.cancel_at_period_end) {
            // Record the cancellation request
            await postgresDb.transactions.create({
              data: {
                userId,
                type: "SUBSCRIPTION_ENDED",
                amount: 0,
                price: "0",
                time: new Date().toISOString(),
                status: "completed",
                pre_transaction_coins: 0,
                post_transaction_coins: 0,
                metadata: {
                  subscriptionId: subscription.id,
                  cancelledAt: new Date().toISOString(),
                  effectiveEndDate: new Date(
                    (subscription as any).current_period_end * 1000
                  ).toISOString(),
                },
              },
            });
          }

          console.log("Updated subscription status for userId:", userId);
        } catch (error) {
          console.error("Error handling subscription update:", error);
          throw error;
        }
        break;
      }

      // Handle when subscription is actually deleted/ended
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        console.log("Subscription deleted:", {
          subscriptionId: subscription.id,
          userId,
          status: subscription.status,
        });

        if (!userId) {
          throw new Error("No user ID found in subscription metadata");
        }

        try {
          // Update user's premium status
          await postgresDb.user.update({
            where: { id: userId },
            data: {
              premium: false,
              premiumUntil: null,
              premiumSince: null,
              premiumPurchasedAt: null,
              purchaseMedium: null,
              purchaseId: null,
            },
          });

          // Record the final cancellation
          await postgresDb.transactions.create({
            data: {
              userId,
              type: "SUBSCRIPTION_ENDED",
              amount: 0,
              price: "0",
              time: new Date().toISOString(),
              status: "completed",
              pre_transaction_coins: 0,
              post_transaction_coins: 0,
              metadata: {
                subscriptionId: subscription.id,
                endedAt: new Date().toISOString(),
              },
            },
          });

          console.log(
            "Updated user premium status after subscription ended for userId:",
            userId
          );
        } catch (error) {
          console.error("Error handling subscription deletion:", error);
          throw error;
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const subscriptionId = paymentIntent.metadata.subscriptionId;
        const coinsAmount = parseInt(paymentIntent.metadata.coinsAmount ?? "0");

        console.log("Processing payment intent:", {
          userId,
          subscriptionId,
          coinsAmount,
        });

        if (!userId) {
          throw new Error("No user ID found in payment intent metadata");
        }

        // Handle subscription payment
        if (subscriptionId) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            console.log("Retrieved subscription:", {
              id: subscription.id,
              status: subscription.status,
            });

            // Calculate premium until date based on subscription period
            const currentDate = new Date();
            const premiumUntil = new Date(currentDate);
            // Add 1 month for monthly subscription, 1 year for yearly
            premiumUntil.setMonth(premiumUntil.getMonth() + 1);

            // Get the user's current premium status
            const user = await postgresDb.user.findUnique({
              where: { id: userId },
              select: { premium: true },
            });

            if (!user) {
              throw new Error("User not found");
            }

            // Update user's premium status
            await postgresDb.user.update({
              where: { id: userId },
              data: {
                premium: true,
                premiumUntil: premiumUntil,
                premiumSince: currentDate,
                premiumPurchasedAt: currentDate,
                purchaseMedium: "STRIPE",
                purchaseId: subscription.id,
              },
            });

            // Record the subscription transaction
            await postgresDb.transactions.create({
              data: {
                userId,
                type: "SUBSCRIPTION",
                amount: 0, // No coins involved in subscription
                price: (paymentIntent.amount / 100).toString(), // Convert cents to dollars
                time: currentDate.toISOString(),
                status: "completed",
                pre_transaction_coins: 0,
                post_transaction_coins: 0,
                metadata: {
                  subscriptionId: subscription.id,
                  subscriptionType:
                    subscription.metadata.isYearly === "true"
                      ? "YEARLY"
                      : "MONTHLY",
                  premiumUntil: premiumUntil.toISOString(),
                },
              },
            });

            console.log(
              "Updated user premium status and recorded transaction for userId:",
              userId
            );
          } catch (error) {
            console.error("Error updating subscription:", error);
            throw error;
          }
        }
        // Handle coins payment
        else if (coinsAmount) {
          try {
            const user = await postgresDb.user.findUnique({
              where: { id: userId },
              select: { coins: true },
            });

            if (!user) {
              throw new Error("User not found");
            }

            await postgresDb.user.update({
              where: { id: userId },
              data: {
                coins: {
                  increment: coinsAmount,
                },
                coinsLastUpdated: new Date(),
              },
            });

            // Record the transaction
            await postgresDb.transactions.create({
              data: {
                userId,
                type: "PURCHASE",
                amount: coinsAmount,
                price: ((coinsAmount / 500) * 0.99).toString(),
                time: new Date().toISOString(),
                status: "completed",
                pre_transaction_coins: user.coins,
                post_transaction_coins: user.coins + coinsAmount,
              },
            });

            console.log("Updated user coins for userId:", userId);
          } catch (error) {
            console.error("Error updating coins:", error);
            throw error;
          }
        }
        break;
      }
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
