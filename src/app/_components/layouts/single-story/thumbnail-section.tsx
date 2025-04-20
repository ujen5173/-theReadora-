import {
  BookmarkCheck02Icon,
  BookOpen01Icon,
  Share01Icon,
} from "hugeicons-react";
import { StarIcon, CheckCircle2, Sparkles, Crown } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";

const ThumbnailSection = () => {
  const premiumFeatures = [
    "Ad-free reading experience",
    "Downloadable Stories",
    "Discounts on premium chapters",
    "Get 7 montly coins",
    "New Chapter Alerts",
    "Support your favorite authors",
  ];

  return (
    <section className="w-full space-y-6">
      <div className="w-full h-auto shadow-lg rounded-md">
        <Image
          src={"/hero-stories/3.jpg"}
          width={600}
          height={1440}
          draggable={false}
          className="rounded-md w-full select-none object-cover aspect-[1/1.5]"
          alt={"Story thumbnail"}
        />
      </div>

      <div className="space-y-2">
        <Button variant={"default"} icon={BookOpen01Icon} className="w-full">
          Start Reading
        </Button>
        <Button variant={"outline"} className="w-full bg-white">
          <div className="flex items-center gap-1">
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <span className="ml-2">...</span>
          </div>
        </Button>
        <Button
          variant={"outline"}
          icon={BookmarkCheck02Icon}
          className="w-full bg-white"
        >
          Save to List
        </Button>
        <Button
          variant={"outline"}
          icon={Share01Icon}
          className="w-full bg-white"
        >
          Share
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/10"></div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Upgrade to Premium
            </h3>
          </div>

          <ul className="space-y-2 mb-4">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-700">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Button icon={Crown} className="w-full" variant="default">
            Subscribe – $9.99/-
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ThumbnailSection;
