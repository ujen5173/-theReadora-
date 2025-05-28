"use client";

import { User } from "lucide-react";
import { useEffect } from "react";
import { type TGetProfile } from "~/server/api/routers/user";
import { useProfileStore } from "~/store/useProfileStore";
import ProfileForm from "./profile-form";
import ProfileFormImage from "./profile-form-image";

const ProfileSettings = ({ user }: { user: TGetProfile }) => {
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    setProfile(user);
  }, [user, setProfile]);

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
          <User className="size-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-primary">Profile Settings</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ProfileFormImage />

        {/* Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
