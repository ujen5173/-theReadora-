import { Tabs, TabsContent, TabsList } from "@radix-ui/react-tabs";
import { CoinsBitcoinIcon, FileSyncIcon } from "hugeicons-react";
import { Bell, CreditCard, ShieldAlert, User } from "lucide-react";
import BillingSection from "./billings/billing";
import CoinsPackageSettings from "./coins";
import DangerZone from "./danger";
import Navigator from "./navigator";
import NotificationSettings from "./notification";
import ProfileSettings from "./profile";
import ReadingHistory from "./reading-history";

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
  {
    value: "history",
    label: "Reading History",
    icon: <FileSyncIcon className="size-5 mr-2" />,
  },
];

const SettingsNavigation = ({ tab }: { tab: string }) => {
  return (
    <Tabs
      value={tab ?? "profile"}
      className="flex flex-col lg:flex-row gap-3 lg:gap-6"
    >
      <TabsList className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:space-y-1 min-w-0 lg:min-w-[220px]">
        {navItems.map((item) => (
          <div key={item.value} className="w-full">
            <Navigator item={item} />
          </div>
        ))}
      </TabsList>
      <div className="flex-1 space-y-4">
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
        <TabsContent value="history">
          <ReadingHistory />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsNavigation;
