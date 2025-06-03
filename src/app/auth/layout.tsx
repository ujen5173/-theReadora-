import React from "react";
import { generateSEOMetadata } from "~/utils/site";

export const metadata = generateSEOMetadata({
  title: "Login to Readora",
  description:
    "Sign in to your Readora account to access your reading list, saved stories, and start writing. Join our community of readers and writers.",
  pathname: "/auth/signin",
  keywords: [
    "login",
    "sign in",
    "account",
    "readora login",
    "reading platform login",
  ],
});

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SigninLayout;
