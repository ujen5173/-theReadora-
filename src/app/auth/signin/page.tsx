// TODO: Redesign affiliate workflow
"use client";

import axios from "axios";
import { Facebook01Icon, GoogleIcon, Mail01Icon } from "hugeicons-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Header from "~/app/_components/layouts/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SignInPage() {
  const callBackURL = useSearchParams().get("callbackUrl");
  const ref = useSearchParams().get("ref");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: callBackURL ?? "/",
      });

      if (result?.error) {
        toast.error("Failed to send magic link. Please try again.");
      } else {
        setMagicLinkSent(true);
        toast.success("Magic link sent! Check your email.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center text-slate-900 min-h-screen">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-700 sm:text-[3rem]">
              Welcome Back Chief
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Sign in/Sign up to continue to{" "}
              <span className="font-bold text-primary underline underline-offset-2">
                Readora
              </span>
            </p>
          </div>
          <div className="w-full max-w-md space-y-4">
            <Button
              size="lg"
              variant="outline"
              onClick={async () => {
                if (!!ref) {
                  await axios.post("/api/set-ref", {
                    ref,
                  });
                }

                signIn("google", {
                  redirectTo: callBackURL ?? "/",
                });
              }}
              className="w-full flex items-center justify-center bg-white hover:bg-slate-50 border-border shadow-sm transition-all duration-200 hover:shadow-md"
              icon={GoogleIcon}
            >
              Continue with Google
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center bg-white hover:bg-slate-50 border-border shadow-sm transition-all duration-200 hover:shadow-md"
              icon={Facebook01Icon}
            >
              Continue with Facebook
            </Button>

            <div className="relative">
              <div className="absolute h-0.5 w-1/2 top-1/2 -translate-y-1/2 bg-slate-200 left-0"></div>
              <div className="absolute h-0.5 w-1/2 top-1/2 -translate-y-1/2 bg-slate-200 right-0"></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-slate-500 bg-white">or</span>
              </div>
            </div>

            {magicLinkSent ? (
              <div className="space-y-6 text-center">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                    <Mail01Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Check your email!
                  </h3>
                  <p className="text-green-700 mb-4">
                    We've sent a magic link to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-green-600">
                    Click the link in your email to sign in. The link will
                    expire in 24 hours.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMagicLinkSent(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Use a different email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-6">
                <div className="space-y-1">
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-600"
                  >
                    Email address
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="hello@readora.com"
                    className="bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-200 hover:shadow-md"
                  icon={Mail01Icon}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Sign in with magic link"}
                </Button>
              </form>
            )}

            <div className="text-center text-sm text-slate-500">
              By signing in, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="text-primary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
