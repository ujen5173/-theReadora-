import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

export const paymentRouter = createTRPCRouter({
  createSubscription: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        isYearly: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { priceId, isYearly } = input;
      const userId = ctx.session.user.id;

      try {
        // Create or retrieve Stripe customer
        let customer: Stripe.Customer;
        const existingCustomers = await stripe.customers.list({
          email: ctx.session.user.email ?? undefined,
          limit: 1,
        });

        if (existingCustomers.data.length > 0 && existingCustomers.data[0]) {
          customer = existingCustomers.data[0];
        } else {
          customer = await stripe.customers.create({
            email: ctx.session.user.email,
            metadata: {
              userId,
            },
          });
        }

        // Create subscription with payment_behavior: 'default_incomplete'
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: priceId }],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice"],
          metadata: {
            userId,
            isYearly: isYearly.toString(),
          },
        });

        const invoice = subscription.latest_invoice as Stripe.Invoice;

        if (!invoice) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create invoice",
          });
        }

        // Create a payment intent for the subscription
        const paymentIntent = await stripe.paymentIntents.create({
          amount: invoice.amount_due,
          currency: invoice.currency,
          customer: customer.id,
          payment_method_types: ["card"],
          metadata: {
            userId,
            subscriptionId: subscription.id,
          },
        });

        if (!paymentIntent?.client_secret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create payment intent",
          });
        }

        return {
          subscriptionId: subscription.id,
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.error("Error creating subscription:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscription",
        });
      }
    }),

  createCoinsPayment: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(500).max(100000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { amount } = input;
      const userId = ctx.session.user.id;
      const price = (amount / 500) * 0.99;

      try {
        // Create or retrieve Stripe customer
        let customer: Stripe.Customer;
        const existingCustomers = await stripe.customers.list({
          email: ctx.session.user.email ?? undefined,
          limit: 1,
        });

        if (existingCustomers.data.length > 0 && existingCustomers.data[0]) {
          customer = existingCustomers.data[0];
        } else {
          customer = await stripe.customers.create({
            email: ctx.session.user.email,
            metadata: {
              userId,
            },
          });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(price * 100), // Convert to cents
          currency: "usd",
          customer: customer.id,
          metadata: {
            userId,
            coinsAmount: amount.toString(),
          },
        });

        if (!paymentIntent.client_secret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create payment intent",
          });
        }

        return {
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.error("Error creating coins payment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment",
        });
      }
    }),

  handleWebhook: protectedProcedure
    .input(
      z.object({
        signature: z.string(),
        payload: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { signature, payload } = input;

      try {
        const event = stripe.webhooks.constructEvent(
          payload,
          signature,
          env.STRIPE_WEBHOOK_SECRET
        );

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;

            if (!userId) {
              throw new Error("No user ID found in session metadata");
            }

            // Handle subscription
            if (session.mode === "subscription") {
              const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
              );
              const isYearly = subscription.metadata.isYearly === "true";

              await ctx.postgresDb.user.update({
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
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata.userId;

            if (!userId) {
              throw new Error("No user ID found in subscription metadata");
            }

            await ctx.postgresDb.user.update({
              where: { id: userId },
              data: {
                premium: false,
                premiumUntil: null,
                premiumSince: null,
                premiumPurchasedAt: null,
                purchaseMedium: "STRIPE",
                purchaseId: null,
              },
            });
            break;
          }

          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const userId = paymentIntent.metadata.userId;
            const coinsAmount = parseInt(
              paymentIntent.metadata.coinsAmount ?? "0"
            );

            if (!userId) {
              throw new Error("No user ID found in payment intent metadata");
            }

            if (coinsAmount) {
              const user = await ctx.postgresDb.user.findUnique({
                where: { id: userId },
                select: { coins: true },
              });

              if (!user) {
                throw new Error("User not found");
              }

              await ctx.postgresDb.user.update({
                where: { id: userId },
                data: {
                  coins: {
                    increment: coinsAmount,
                  },
                  coinsLastUpdated: new Date(),
                },
              });

              // Record the transaction
              await ctx.postgresDb.transactions.create({
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
            }
            break;
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Webhook error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Webhook processing failed",
        });
      }
    }),

  cancelSubscription: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { subscriptionId } = input;
      const userId = ctx.session.user.id;

      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        // Verify the subscription belongs to the user
        if (subscription.metadata.userId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to cancel this subscription",
          });
        }

        // Cancel the subscription at period end
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });

        return { success: true };
      } catch (error) {
        console.error("Error cancelling subscription:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel subscription",
        });
      }
    }),
});
