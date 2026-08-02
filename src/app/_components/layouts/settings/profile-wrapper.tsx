"use client";

import { UserIcon } from "hugeicons-react";
import { useEffect } from "react";
import type { TGetProfile } from "~/server/api/routers/user";
import { useProfileStore } from "~/store/useProfileStore";
import ProfileForm from "./profile-form";
import ProfileFormImage from "./profile-form-image";

const ProfileSettings = ({ user }: { user: TGetProfile }) => {
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    setProfile(user);
  }, [user, setProfile]);

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6 border border-primary/20 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 border border-primary/20 rounded-full">
          <UserIcon className="size-5 text-primary" />
        </div>
        <h3 className="font-bold text-primary text-lg">Profile Settings</h3>
      </div>

      <div className="gap-4 sm:gap-6 grid md:grid-cols-3">
        <ProfileFormImage />

        {/* Profile Information */}
        <div className="space-y-6 md:col-span-2">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
