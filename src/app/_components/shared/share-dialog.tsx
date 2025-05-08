"use client";

import {
  Facebook01Icon,
  RedditIcon,
  Share01Icon,
  TwitterIcon,
  WhatsappIcon,
} from "hugeicons-react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface ShareDialogProps {
  title: string;
  url: string;
  description?: string;
  trigger?: React.ReactNode;
}

const socialPlatforms = [
  {
    name: "Twitter",
    icon: TwitterIcon,
    color: "bg-[#1DA1F2]/10 text-[#1DA1F2]",
    hoverColor: "hover:bg-[#1DA1F2]/20",
    getShareUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: Facebook01Icon,
    color: "bg-[#4267B2]/10 text-[#4267B2]",
    hoverColor: "hover:bg-[#4267B2]/20",
    getShareUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    icon: RedditIcon,
    color: "bg-[#FF4500]/10 text-[#FF4500]",
    hoverColor: "hover:bg-[#FF4500]/20",
    getShareUrl: (url: string, title: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "WhatsApp",
    icon: WhatsappIcon,
    color: "bg-[#25D366]/10 text-[#25D366]",
    hoverColor: "hover:bg-[#25D366]/20",
    getShareUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

const ShareDialog = ({
  title,
  url,
  description,
  trigger,
}: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: (typeof socialPlatforms)[number]) => {
    window.open(platform.getShareUrl(url, title), "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            icon={Share01Icon}
            className="w-full bg-white"
          >
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-800 font-bold">
            Share to the world 🌍
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title and Description */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-slate-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          {/* Copy Link Section */}
          <div className="flex items-center space-x-2">
            <div className="min-w-0 flex-1">
              <Input
                className="text-sm text-slate-600 line-clamp-1 w-full"
                value={url}
                onClick={handleCopy}
                readOnly
              />
            </div>
            <Button
              size="sm"
              className={cn(
                "transition-all duration-200 whitespace-nowrap",
                "bg-slate-900 hover:bg-slate-800 text-white"
              )}
              icon={copied ? Check : Copy}
              iconPlacement="left"
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          {/* Social Share Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">
              Share on social media
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  className={cn(
                    "transition-colors",
                    platform.color,
                    platform.hoverColor
                  )}
                  onClick={() => handleShare(platform)}
                  icon={platform.icon}
                >
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
