"use client";

import { Bell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";

// Define the type for preferences
type NotificationPreferences = {
  chapterUpdates: boolean;
  storyCompletion: boolean;
  readingReminders: boolean;
  storyRecommendations: boolean;
  authorUpdates: boolean;
  premiumBenefits: boolean;
  coinsAndTransactions: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
};

const defaultPreferences: NotificationPreferences = {
  chapterUpdates: true,
  storyCompletion: true,
  readingReminders: true,
  storyRecommendations: true,
  authorUpdates: true,
  premiumBenefits: true,
  coinsAndTransactions: true,
  emailNotifications: true,
  marketingEmails: true,
};

const NotificationSettings = () => {
  const { data, isLoading } = api.user.getEmailPreferences.useQuery();
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(defaultPreferences);
  const [isModified, setIsModified] = useState(false);

  const updatePreferences = api.user.changeNotificationPreference.useMutation({
    onSuccess: () => {
      toast("Notification preferences updated successfully");
      setIsModified(false);
    },
    onError: (error) => {
      toast.error("Failed to update preferences: " + error.message);
      // Revert to the last known good state
      if (data?.emailPreferences) {
        setPreferences(data.emailPreferences as NotificationPreferences);
      }
    },
  });

  useEffect(() => {
    if (data?.emailPreferences) {
      try {
        // First, ensure we have a valid object
        const parsedPreferences =
          typeof data.emailPreferences === "string"
            ? JSON.parse(data.emailPreferences)
            : data.emailPreferences;

        // Create a new preferences object with default values
        const newPreferences = { ...defaultPreferences };

        // Only update values that exist in the parsed data and are boolean
        Object.keys(defaultPreferences).forEach((key) => {
          const typedKey = key as keyof NotificationPreferences;
          if (
            parsedPreferences[typedKey] !== undefined &&
            typeof parsedPreferences[typedKey] === "boolean"
          ) {
            newPreferences[typedKey] = parsedPreferences[typedKey];
          }
        });

        setPreferences(newPreferences);
      } catch (error) {
        console.error("Error parsing preferences:", error);
        setPreferences(defaultPreferences);
      }
    }
  }, [data]);

  const handlePreferenceChange = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setIsModified(true);
  };

  const handleDisableAll = () => {
    const disabledPreferences: NotificationPreferences = {
      ...defaultPreferences,
      ...Object.keys(defaultPreferences).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {} as NotificationPreferences
      ),
    };
    setPreferences(disabledPreferences);
    setIsModified(true);
  };

  const handleSavePreferences = () => {
    updatePreferences.mutate(preferences);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20">
            <Bell className="size-4 sm:size-5 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-primary">
            Notification Preferences
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleDisableAll}
          >
            Disable All
          </Button>
          <Button
            variant="default"
            icon={updatePreferences.status === "pending" ? Loader2 : undefined}
            iconStyle={
              updatePreferences.status === "pending" ? "animate-spin" : ""
            }
            disabled={!isModified || updatePreferences.status === "pending"}
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleSavePreferences}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="rounded-lg border border-primary/20 bg-white p-4 sm:p-6">
          <h4 className="font-semibold mb-3 sm:mb-4">Reading Updates</h4>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    Chapter Updates
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get notified when new chapters are released for stories you're
                  following
                </p>
              </div>
              <Switch
                checked={preferences.chapterUpdates}
                onCheckedChange={() => handlePreferenceChange("chapterUpdates")}
                className="ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    Story Completion
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when stories you're reading are
                  completed
                </p>
              </div>
              <Switch
                checked={preferences.storyCompletion}
                onCheckedChange={() =>
                  handlePreferenceChange("storyCompletion")
                }
                className="ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Reading Reminders
                </p>
                <p className="text-sm text-muted-foreground">
                  Get gentle reminders about stories you haven't read in a while
                </p>
              </div>
              <Switch
                checked={preferences.readingReminders}
                onCheckedChange={() =>
                  handlePreferenceChange("readingReminders")
                }
                className="ml-4"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-white p-4 sm:p-6">
          <h4 className="font-semibold mb-3 sm:mb-4">Community & Social</h4>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Story Recommendations
                </p>
                <p className="text-sm text-muted-foreground">
                  Get personalized story recommendations based on your reading
                  history
                </p>
              </div>
              <Switch
                checked={preferences.storyRecommendations}
                onCheckedChange={() =>
                  handlePreferenceChange("storyRecommendations")
                }
                className="ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Author Updates
                </p>
                <p className="text-sm text-muted-foreground">
                  Updates from authors you follow about new stories or
                  announcements
                </p>
              </div>
              <Switch
                checked={preferences.authorUpdates}
                onCheckedChange={() => handlePreferenceChange("authorUpdates")}
                className="ml-4"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-white p-4 sm:p-6">
          <h4 className="font-semibold mb-3 sm:mb-4">Account & Security</h4>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Premium Benefits
                </p>
                <p className="text-sm text-muted-foreground">
                  Updates about your premium subscription and exclusive benefits
                </p>
              </div>
              <Switch
                checked={preferences.premiumBenefits}
                onCheckedChange={() =>
                  handlePreferenceChange("premiumBenefits")
                }
                className="ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Coins & Transactions
                </p>
                <p className="text-sm text-muted-foreground">
                  Notifications about coin purchases, usage, and special offers
                </p>
              </div>
              <Switch
                checked={preferences.coinsAndTransactions}
                onCheckedChange={() =>
                  handlePreferenceChange("coinsAndTransactions")
                }
                className="ml-4"
              />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-white p-4 sm:p-6">
          <h4 className="font-semibold mb-3 sm:mb-4">Email Preferences</h4>
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Email Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={() =>
                  handlePreferenceChange("emailNotifications")
                }
                className="ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Marketing Emails
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features, promotions, and special
                  offers
                </p>
              </div>
              <Switch
                checked={preferences.marketingEmails}
                onCheckedChange={() =>
                  handlePreferenceChange("marketingEmails")
                }
                className="ml-4"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
