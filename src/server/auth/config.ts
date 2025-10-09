import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";

import { sendMagicLinkEmail } from "~/lib/email/sendEmail";
import { postgresDb } from "~/server/postgresql";
import { makeSlug } from "~/utils/helpers";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      premium: boolean;
      coins: number;
      image: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  trustHost: true,
  providers: [
    GoogleProvider({
      async profile(profile: GoogleProfile) {
        const usernameOccurance = await postgresDb.user.findMany({
          where: {
            username: {
              startsWith: makeSlug(profile.name),
            },
          },
        });
        const isUsernameExists = (username: string): boolean => {
          return usernameOccurance.some((user) => user.username === username);
        };
        // Function to generate a random number
        const generateRandomNumber = () => {
          return Math.floor(Math.random() * 10);
        };
        // Function to generate a unique username
        const generateUniqueUsername = (desiredUsername: string): string => {
          let username = desiredUsername;
          let suffix = 1;
          const maxAttempts = 10; // Add a maximum number of attempts
          let attempts = 0;
          while (isUsernameExists(username) && attempts < maxAttempts) {
            username = `${desiredUsername}${generateRandomNumber()}${suffix}`;
            suffix++;
            attempts++;
          }
          if (attempts === maxAttempts) {
            // Handle the case when a unique username couldn't be generated
            username = `${desiredUsername}_${Date.now()}`;
          }
          return username;
        };

        return {
          id: profile.sub,
          name: profile.name,
          username: generateUniqueUsername(makeSlug(profile.name)),
          image: profile.picture,
          email: profile.email,
        };
      },
    }),
    // Resend provider for magic link authentication with custom template
    Nodemailer({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_KEY, // Your Resend API key
        },
      },
      from: process.env.EMAIL_FROM || "Readora <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        await sendMagicLinkEmail({
          email,
          magicLink: url,
        });
      },
    }),
  ],
  adapter: PrismaAdapter(postgresDb),
  callbacks: {
    async signIn({ user, account, profile }) {
      // For email provider, we need to create a username
      if (account?.provider === "nodemailer" && user.email) {
        const existingUser = await postgresDb.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Generate a unique username for email users
          const baseUsername = user.email.split("@")[0] || "user";
          const usernameOccurance = await postgresDb.user.findMany({
            where: {
              username: {
                startsWith: makeSlug(baseUsername),
              },
            },
          });

          const isUsernameExists = (username: string): boolean => {
            return usernameOccurance.some((u) => u.username === username);
          };

          const generateUniqueUsername = (desiredUsername: string): string => {
            let username = desiredUsername;
            let suffix = 1;
            const maxAttempts = 10;
            let attempts = 0;
            while (isUsernameExists(username) && attempts < maxAttempts) {
              username = `${desiredUsername}${Math.floor(
                Math.random() * 10
              )}${suffix}`;
              suffix++;
              attempts++;
            }
            if (attempts === maxAttempts) {
              username = `${desiredUsername}_${Date.now()}`;
            }
            return username;
          };

          user.username = generateUniqueUsername(makeSlug(baseUsername));
          user.name = user.name || user.email.split("@")[0];
        }
      }
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        id: user.id,
        name: session.user.name,
        username: session.user.username,
        email: session.user.email,
        image: session.user.image,
        coins: session.user.coins,
        premium: session.user.premium,
      },
    }),
  },
} satisfies NextAuthConfig;
