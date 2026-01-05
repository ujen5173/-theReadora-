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

// Helper function to transliterate non-ASCII characters
function transliterate(text: string): string {
  text = text.replace(/\s+/g, "_").trim();

  let result = text.replace(/[^a-zA-Z0-9_-]/g, "");

  return result;
}

// Helper function to clean username
function cleanUsername(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/^[_-]+|[_-]+$/g, "")
    .replace(/[_-]{2,}/g, "_")
    .substring(0, 30);
}

// Helper function to generate random string
function generateRandomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to generate random number in range
function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Main function to generate base username from name or email
function generateBaseUsername(
  name: string,
  email: string,
  userId?: string
): string {
  const trimmedName = name.trim();

  let username = transliterate(trimmedName);

  if (!username || username.length < 3) {
    username = makeSlug(trimmedName);
  }

  if (!username || username.length < 3) {
    const emailPrefix = email.split("@")[0]!;
    username = transliterate(emailPrefix);

    if (!username || username.length < 3) {
      username = makeSlug(emailPrefix);
    }
  }

  if (!username || username.length < 3) {
    username = userId
      ? `user_${userId.substring(0, 8)}`
      : `user_${generateRandomString(6)}`;
  }

  username = cleanUsername(username);

  if (username.length < 3) {
    username = `user_${generateRandomString(6)}`;
  }

  return username.toLowerCase();
}

// Function to ensure username uniqueness
async function ensureUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await postgresDb.user.findUnique({
      where: { username },
      select: { username: true },
    });

    if (!existing) {
      return username;
    }

    if (attempts === 0) {
      username = `${baseUsername}_${generateRandomNumber(1000, 9999)}`;
    } else {
      username = `${baseUsername}_${generateRandomString(4)}`;
    }

    attempts++;
  }

  return `${baseUsername}_${Date.now().toString(36)}`;
}

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  trustHost: true,
  providers: [
    GoogleProvider({
      async profile(profile: GoogleProfile) {
        const baseUsername = generateBaseUsername(
          profile.name,
          profile.email,
          profile.sub
        );

        const uniqueUsername = await ensureUniqueUsername(baseUsername);

        return {
          id: profile.sub,
          name: profile.name,
          username: uniqueUsername,
          image: profile.picture,
          email: profile.email,
        };
      },
    }),
    Nodemailer({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_KEY,
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
      if (account?.provider === "nodemailer" && user.email) {
        const existingUser = await postgresDb.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const emailPrefix = user.email.split("@")[0] || "user";
          const userName = user.name || emailPrefix;

          const baseUsername = generateBaseUsername(
            userName,
            user.email,
            user.id
          );

          user.username = await ensureUniqueUsername(baseUsername);
          user.name = user.name || emailPrefix;
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
