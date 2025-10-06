"use client";

import {
  CheckCircle,
  Copy,
  Gift,
  Loader2,
  QrCode,
  UserPlus,
  Users,
} from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import { merriweatherFont } from "~/utils/font";

const AffiliateProgramEnrolled = () => {
  const { user, isLoading } = useUserStore();
  const { data: stats, isLoading: statsLoading } =
    api.affiliate.getStats.useQuery(undefined, {
      enabled: !!user?.id,
    });

  const { data: history, isLoading: historyLoading } =
    api.affiliate.getHistory.useQuery(undefined, {
      enabled: !!user?.id,
    });

  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (isLoading || !user?.id || statsLoading || historyLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const referralCode = user.id;
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

  const progress = stats ? Math.min(stats.users / 10, 1) : 0;
  const milestoneLeft = stats ? Math.max(0, 10 - stats.users) : 10;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2
          className={cn(
            "mb-2 flex items-center gap-2 text-2xl font-bold text-slate-700",
            merriweatherFont.className
          )}
        >
          <Gift className="h-7 w-7 text-primary" /> Affiliate Program
        </h2>
        <p className="mb-6 text-base text-slate-600">
          Help us grow the Readora community and get rewarded! Choose your path:
        </p>
      </div>

      {/* Milestone Progress */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-white p-4">
        <div className="flex items-center gap-2">
          <CheckCircle
            className={progress === 1 ? "text-green-500" : "text-slate-400"}
          />
          <span className="font-medium text-slate-700">
            {progress === 1
              ? "Milestone reached!"
              : `Refer ${milestoneLeft} more to unlock a bonus reward!`}
          </span>
        </div>
        <div className="relative h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Referral Link Generator */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-slate-50 p-4">
        <div className="flex w-full max-w-xl items-center gap-2">
          <Input
            type="text"
            value={referralLink}
            readOnly
            onClick={handleCopy}
            className="h-[2.1rem]"
          />
          <Button size="sm" onClick={handleCopy} disabled={!referralCode}>
            <Copy className="mr-1 h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQR((v) => !v)}
            className="rounded-r-md border-l-0"
            disabled={!referralCode}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMsg}
            disabled={!referralCode}
          >
            {copiedMsg ? "Message Copied!" : "Copy Invite Message"}
          </Button>
        </div>
        {showQR && (
          <div className="mt-2 rounded-lg border border-border bg-white p-2">
            <QRCode value={referralLink} size={120} />
          </div>
        )}
        <span className="text-xs text-slate-500">
          Share this link or QR code to invite users.
        </span>
      </div>

      {/* Referral Stats */}

      {/* Affiliate Options */}
      <div className="grid grid-cols-2 gap-4">
        {stats && (
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-border bg-white p-4 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <Users className="mb-1 h-6 w-6 text-primary" />
              <div className="text-lg font-bold text-primary">
                {stats.users}
              </div>
              <div className="text-xs text-slate-500">Users Referred</div>
            </div>

            <div className="flex flex-col items-center">
              <Gift className="mb-1 h-6 w-6 text-primary" />
              <div className="text-lg font-bold text-primary">
                {stats.coins}
              </div>
              <div className="text-xs text-slate-500">Points Earned</div>
            </div>
          </div>
        )}
        {/* Onboard New Users */}
        <div className="flex flex-col items-start rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-slate-700">
              Onboard New Users
            </h3>
          </div>
          <p className="mb-4 text-slate-600">
            Invite friends to Readora! Both you and your friend can{" "}
            <span className="font-bold text-primary">claim coins</span> and use
            them for free chapter unlocks.
          </p>
          <span className="inline-block rounded border border-primary/10 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Redeem points, Unlock stories
          </span>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="mt-8 rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <span className="font-semibold text-slate-700">Referral History</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Date</th>
                <th className="px-2 py-1 text-left">Reward</th>
              </tr>
            </thead>
            <tbody>
              {history && history.length > 0 ? (
                history.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-2 py-1">{r.name}</td>

                    <td className="px-2 py-1">{r.date}</td>

                    <td className="px-2 py-1">{r.reward}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-4 text-center text-slate-400"
                  >
                    No referral history yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <Button size="lg" onClick={handleCopy} disabled={!referralCode}>
          {copied ? "Copied!" : "Get Your Referral Link"}
        </Button>
        <p className="max-w-lg text-center text-sm text-slate-500">
          Share your referral link with users. When they sign up and complete
          their first booking, you both get rewarded!
        </p>
      </div>
    </div>
  );
};

export default AffiliateProgramEnrolled;
