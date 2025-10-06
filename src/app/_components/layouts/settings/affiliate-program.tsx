"use client";

import { ArrowRight, Gift, Loader2, Sparkles, Users } from "lucide-react";
import { useState } from "react";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { kanit } from "~/utils/font";
import AffiliateProgramEnrolled from "./affiliate-program-enrolled";

const AffiliateProgram = () => {
  const {
    data: enrolled,
    isLoading,
    refetch,
  } = api.affiliate.isUserEnrolled.useQuery();

  const enrollMutation = api.affiliate.enroll.useMutation();

  const [enrolling, setEnrolling] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (enrolled) {
    return <AffiliateProgramEnrolled />;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-2 rounded-full bg-primary/10 p-4">
          <Gift className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800">
          Join
          <div className="mx-2 inline-block">
            <Link href="/">
              <span
                className={cn(
                  "cursor-pointer select-none underline font-black text-primary/90",
                  kanit.className
                )}
              >
                [theReadora]
              </span>
            </Link>
          </div>
          Affiliate Program!
        </h2>
        <p className="max-w-xl text-center text-lg text-slate-600">
          Help us grow theReadora community and get rewarded for every friend
          you bring on board. Get coins to unlock stories!
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-xl border border-border bg-white p-6 shadow">
          <Users className="mb-2 h-8 w-8 text-primary" />
          <h3 className="mb-1 text-lg font-bold">Earn Points</h3>
          <p className="text-center text-slate-500">
            Get points for every user you refer. Redeem them for free rides and
            rewards!
          </p>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-border bg-white p-6 shadow">
          <Sparkles className="mb-2 h-8 w-8 text-primary" />
          <h3 className="mb-1 text-lg font-bold">Unlock Milestone Bonuses</h3>
          <p className="text-center text-slate-500">
            Hit referral milestones to unlock special rewards and recognition in
            the community!
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-xl border border-border bg-slate-50 p-6">
        <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-700">
          <ArrowRight className="h-5 w-5 text-primary" /> How It Works
        </h4>
        <ol className="list-inside list-decimal space-y-2 text-slate-600">
          <li>
            Click the <span className="font-semibold text-primary">Enroll</span>{" "}
            button below.
          </li>
          <li>Get your unique referral link and share it with friends.</li>
          <li>
            Earn points and rewards when they sign up and complete their first
            booking!
          </li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Button
          size="lg"
          disabled={enrolling || enrollMutation.status === "pending"}
          onClick={async () => {
            setEnrolling(true);
            await enrollMutation.mutateAsync();
            setEnrolling(false);
            void refetch();
          }}
        >
          {enrolling || enrollMutation.status === "pending" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Enrolling...
            </>
          ) : (
            "Enroll Now"
          )}
        </Button>
        {enrollMutation.error && (
          <span className="mt-2 text-sm text-red-500">
            {enrollMutation.error.message}
          </span>
        )}
        <div className="mt-8 max-w-lg text-center italic text-slate-500">
          “Over <span className="font-bold text-primary">500+</span> users have
          already earned rewards through our affiliate program. Join them
          today!”
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;
