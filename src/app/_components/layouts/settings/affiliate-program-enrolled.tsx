"use client";

import {
  Award01Icon,
  ChartIncreaseIcon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  GiftIcon,
  Loading03Icon,
  QrCodeIcon,
  Share08Icon,
  UserAdd01Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import { merriweatherFont } from "~/utils/font";

const AffiliateProgramEnrolled = () => {
  const { user, isLoading } = useUserStore();
  const { data: codeData } = api.affiliate.getCode.useQuery(undefined, {
    enabled: !!user?.id,
  });
  const { data: stats, isLoading: statsLoading } =
    api.affiliate.getStats.useQuery(undefined, { enabled: !!user?.id });
  const { data: history, isLoading: historyLoading } =
    api.affiliate.getHistory.useQuery(undefined, { enabled: !!user?.id });

  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (isLoading || !user?.id || statsLoading || historyLoading) {
    return (
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center py-16">
          <Loading03Icon className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading affiliate program...
          </p>
        </div>
      </div>
    );
  }

  const referralCode = codeData?.code ?? "";
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/signin?ref=${referralCode}`
      : `https://yourdomain.com/auth/signin?ref=${referralCode}`;
  const referralMessage = `Join me on Readora! Use my referral link to sign up: ${referralLink}`;

  const handleCopy = () => {
    void navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyMsg = () => {
    void navigator.clipboard.writeText(referralMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 1500);
  };

  const progress = stats ? Math.min((stats.users ?? 0) / 10, 1) : 0;
  const milestoneLeft = stats ? Math.max(0, 10 - (stats.users ?? 0)) : 10;

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20">
          <GiftIcon className="size-4 sm:size-5 text-primary" />
        </div>
        <h2
          className={cn(
            "text-base sm:text-lg font-bold text-primary",
            merriweatherFont.className,
          )}
        >
          Affiliate Program
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col gap-2 items-center">
                <div className="p-2 rounded-full bg-primary/10">
                  <Award01Icon className="size-5 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-slate-700">
                    Milestone Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {progress === 1
                      ? "🎉 Milestone reached! You've unlocked bonus rewards!"
                      : `Refer ${milestoneLeft} more users to unlock bonus rewards`}
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {stats?.users ?? 0}/10 users
                  </span>
                </div>
                <Progress value={progress * 100} className="h-3" />
                {progress === 1 && (
                  <Badge variant="default" className="mx-auto">
                    <CheckmarkCircle02Icon className="size-3 mr-1" />
                    Milestone Complete!
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share08Icon className="size-5 text-primary" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Your referral code:{" "}
              <span className="font-mono font-semibold text-primary">
                {referralCode || "—"}
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <Input
                type="text"
                value={referralLink}
                readOnly
                onClick={handleCopy}
                className="h-10 font-mono text-sm"
              />
              <Button size="sm" onClick={handleCopy} disabled={!referralCode}>
                <Copy01Icon className="size-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR((v) => !v)}
                disabled={!referralCode}
              >
                <QrCodeIcon className="size-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMsg}
                disabled={!referralCode}
                className="flex-1 sm:flex-none"
              >
                {copiedMsg ? "Message Copied!" : "Copy Invite Message"}
              </Button>
            </div>

            {showQR && (
              <div className="flex justify-center p-4 rounded-lg border border-border bg-slate-50">
                <QRCode value={referralLink} size={120} />
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Share this link or QR code to invite users and earn rewards!
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {stats && (
            <Card className="border-primary/20 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ChartIncreaseIcon className="size-5 text-primary" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                      <UserMultipleIcon className="size-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stats.users}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Users Referred
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                      <GiftIcon className="size-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stats.coins.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Coins Earned
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                      <ChartIncreaseIcon className="size-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {(stats.clicks ?? 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Link Clicks
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/20 bg-white">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserAdd01Icon className="size-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Invite friends to Readora! Both you and your friend can{" "}
                <span className="font-semibold text-primary">claim coins</span>{" "}
                and use them for free chapter unlocks.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Share your referral link</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Friend signs up and reads</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>You both earn coins!</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit">
                <GiftIcon className="size-3 mr-1" />
                Redeem points, Unlock stories
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserAdd01Icon className="size-5 text-primary" />
              Referral History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <UserAdd01Icon className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {r.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">{r.reward}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                  <UserAdd01Icon className="size-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-2">
                  No referral history yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start sharing your referral link to see your referrals here!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateProgramEnrolled;
