import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig, type User } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";

import { postgresDb } from "~/server/postgresql";
import { makeSlug } from "~/utils/helpers";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      emailVerified: Date | null;
      image: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
  }
}

export const authConfig = {
  providers: [
    GoogleProvider({
      async profile(profile: GoogleProfile): Promise<User> {
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
  ],
  adapter: PrismaAdapter(postgresDb) as Adapter,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
