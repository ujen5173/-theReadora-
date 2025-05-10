import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { CoinsBitcoinIcon } from "hugeicons-react";
import { Bell, CreditCard, ShieldAlert, User } from "lucide-react";
import Header from "../_components/layouts/header";
import BillingSection from "../_components/layouts/settings/billings/billing";
import CoinsPackageSettings from "../_components/layouts/settings/coins";
import DangerZone from "../_components/layouts/settings/danger";
import NotificationSettings from "../_components/layouts/settings/notification";
import ProfileSettings from "../_components/layouts/settings/profile";

const navItems = [
  {
    value: "profile",
    label: "Profile",
    icon: <User className="size-5 mr-2" />,
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: <Bell className="size-5 mr-2" />,
  },
  {
    value: "danger",
    label: "Danger Zone",
    icon: <ShieldAlert className="size-5 mr-2" />,
  },
  {
    value: "coins",
    label: "Coins",
    icon: <CoinsBitcoinIcon className="size-5 mr-2" />,
  },
  {
    value: "billing",
    label: "Billing",
    icon: <CreditCard className="size-5 mr-2" />,
  },
];

const Settings = async ({
  searchParams,
}: {
  searchParams: Promise<{ tab: string }>;
}) => {
  const { tab } = await searchParams;
  return (
    <>
      <Header
        background={false}
        removeBackground
        headerExtraStyle="border-b border-border shadow-sm"
      />
      <div className="w-full">
        <div className="border-b border-border max-w-[1440px] mx-auto px-4 py-12">
          <SettingsNavigation tab={tab} />
        </div>
      </div>
    </>
  );
};

export default Settings;

const SettingsNavigation = ({ tab }: { tab: string }) => {
  return (
    <Tabs defaultValue={tab ?? "profile"} className="flex gap-8">
      <TabsList className="flex flex-col h-fit space-y-1 min-w-[240px]">
        {navItems.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex items-center justify-start w-full px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium"
          >
            {item.icon}
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex-1 space-y-6">
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
        <TabsContent value="coins">
          <CoinsPackageSettings />
        </TabsContent>
        <TabsContent value="billing">
          <BillingSection />
        </TabsContent>
      </div>
    </Tabs>
  );
};
