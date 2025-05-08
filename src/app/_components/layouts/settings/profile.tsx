import { api } from "~/trpc/server";
import ProfileSettingsWrapper from "./profile-wrapper";

const ProfileSettings = async () => {
  const user = await api.user.getProfile();

  return <ProfileSettingsWrapper user={user} />;
};

export default ProfileSettings;
