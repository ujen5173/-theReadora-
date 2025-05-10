"use client";

import { Facebook01Icon, GoogleIcon, Mail01Icon } from "hugeicons-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "~/app/_components/layouts/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SignInPage() {
  const callBackURL = useSearchParams().get("callbackUrl");

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-center text-slate-900">
        <div className="border-b border-border container flex flex-col items-center justify-center gap-8 px-4 py-28">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-700 sm:text-[3rem]">
              Welcome Back Chief
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Sign in to continue to{" "}
              <span className="font-bold text-primary underline underline-offset-2">
                Readora
              </span>
            </p>
          </div>

          <div className="w-full max-w-md space-y-2">
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                signIn("google", {
                  redirectTo: callBackURL ?? "/",
                })
              }
              className="w-full flex items-center justify-center bg-white hover:bg-slate-50 border-border"
              icon={GoogleIcon}
            >
              Continue with Google
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full flex items-center justify-center bg-white hover:bg-slate-50 border-border"
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

            <form className="space-y-6">
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
                  required
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-600"
                >
                  Password
                </Label>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  className="bg-white"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white"
                icon={Mail01Icon}
              >
                Sign in with Email
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
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
