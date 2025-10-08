"use client";

import {
  ArrowRight,
  Award,
  Gift,
  HandshakeIcon,
  Loader2,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading affiliate program...
          </p>
        </div>
      </div>
    );
  }

  if (enrolled) {
    return <AffiliateProgramEnrolled />;
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20">
          <HandshakeIcon className="size-4 sm:size-5 text-primary" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-primary">
          Affiliate Program
        </h2>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
            <Gift className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
              Join the
              <Link href="/" className="mx-2">
                <span
                  className={cn(
                    "cursor-pointer select-none underline font-black text-primary/90",
                    kanit.className
                  )}
                >
                  [theReadora]
                </span>
              </Link>
              Affiliate Program!
            </h3>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
              Help us grow theReadora community and get rewarded for every
              friend you bring on board. Get coins to unlock stories!
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card className="border-primary/20 bg-white">
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Earn Coins</h3>
              <p className="text-slate-600">
                Get coins for every user you refer. Redeem them for free chapter
                unlocks and premium features!
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-white">
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">
                Unlock Milestone Bonuses
              </h3>
              <p className="text-slate-600">
                Hit referral milestones to unlock special rewards and
                recognition in the community!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-primary/20 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ArrowRight className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Enroll in the Program</h4>
                  <p className="text-slate-600">
                    Click the{" "}
                    <span className="font-semibold text-primary">Enroll</span>{" "}
                    button below to join our affiliate program.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Get Your Referral Link</h4>
                  <p className="text-slate-600">
                    Receive your unique referral link and QR code to share with
                    friends.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Earn Rewards</h4>
                  <p className="text-slate-600">
                    Earn coins and rewards when your friends sign up and start
                    reading!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6 text-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                  <HandshakeIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Ready to Start Earning?
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Join over{" "}
                    <span className="font-bold text-primary">500+</span> users
                    who are already earning rewards through our affiliate
                    program!
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  disabled={enrolling || enrollMutation.status === "pending"}
                  onClick={async () => {
                    setEnrolling(true);
                    await enrollMutation.mutateAsync();
                    setEnrolling(false);
                    void refetch();
                  }}
                  className="w-full sm:w-auto"
                >
                  {enrolling || enrollMutation.status === "pending" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-5 w-5" />
                      Enroll Now
                    </>
                  )}
                </Button>

                {enrollMutation.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">
                      {enrollMutation.error.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Join the growing community of successful affiliates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateProgram;
