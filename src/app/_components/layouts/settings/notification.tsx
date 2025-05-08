import { Bell } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";

const NotificationSettings = () => {
  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
            <Bell className="size-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-primary">
            Notification Preferences
          </h3>
        </div>
        <Button variant="outline" size="sm">
          Disable All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Reading Updates */}
        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <h4 className="font-semibold mb-4">Reading Updates</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
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
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
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
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Reading Reminders
                </p>
                <p className="text-sm text-muted-foreground">
                  Get gentle reminders about stories you haven't read in a while
                </p>
              </div>
              <Switch className="ml-4" />
            </label>
          </div>
        </div>

        {/* Community & Social */}
        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <h4 className="font-semibold mb-4">Community & Social</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    Comments & Replies
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notifications for comments on your stories and replies to your
                  comments
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Story Recommendations
                </p>
                <p className="text-sm text-muted-foreground">
                  Get personalized story recommendations based on your reading
                  history
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Author Updates
                </p>
                <p className="text-sm text-muted-foreground">
                  Updates from authors you follow about new stories or
                  announcements
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>
          </div>
        </div>

        {/* Account & Security */}
        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <h4 className="font-semibold mb-4">Account & Security</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    Security Alerts
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Important notifications about your account security
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Premium Benefits
                </p>
                <p className="text-sm text-muted-foreground">
                  Updates about your premium subscription and exclusive benefits
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Coins & Transactions
                </p>
                <p className="text-sm text-muted-foreground">
                  Notifications about coin purchases, usage, and special offers
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>
          </div>
        </div>

        {/* Email Preferences */}
        <div className="rounded-lg border border-primary/20 bg-white p-6">
          <h4 className="font-semibold mb-4">Email Preferences</h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Email Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
              <Switch defaultChecked className="ml-4" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="flex-1">
                <p className="font-medium group-hover:text-primary transition-colors mb-1">
                  Marketing Emails
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features, promotions, and special
                  offers
                </p>
              </div>
              <Switch className="ml-4" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
