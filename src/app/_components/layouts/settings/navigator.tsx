"use client";

import { useRouter } from "next/navigation";
import { type JSX } from "react";
import { TabsTrigger } from "~/components/ui/tabs";

const Navigator = ({
  item,
}: {
  item: {
    value: string;
    label: string;
    icon: JSX.Element;
  };
}) => {
  const router = useRouter();
  const { value, label, icon } = item;

  return (
    <TabsTrigger
      key={value}
      value={value}
      onClick={() => {
        router.push("?tab=" + value);
      }}
      className="w-full flex items-center justify-start whitespace-nowrap px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium"
    >
      {icon}
      {label}
    </TabsTrigger>
  );
};

export default Navigator;
