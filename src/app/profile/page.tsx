import type { Metadata } from "next";
import { api } from "~/trpc/server";
import Header from "../_components/layouts/header";
import ProfileMetaData from "../_components/layouts/profile/profile-meta-data";
import ProfileWrapper from "../_components/layouts/profile/wrapper";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ user: string }>;
}): Promise<Metadata> {
  const { user } = await searchParams;
  const userdata = await api.user.getUserDetails({
    usernameOrId: user,
  });

  return {
    title: `${userdata.name} (@${userdata.username}) | Readora`,
    description: `Check out ${userdata.name}'s profile on Readora`,
  };
}

const UserProfile = async ({
  searchParams,
}: {
  searchParams: Promise<{ user: string }>;
}) => {
  const { user } = await searchParams;

  const userDetails = await api.user.getUserDetails({
    usernameOrId: user,
  });

  return (
    <>
      <Header
        background={false}
        removeBackground
        headerExtraStyle="border-b border-border shadow-md"
      />

      <main className="">
        <ProfileWrapper details={userDetails}>
          <ProfileMetaData />
        </ProfileWrapper>
      </main>
    </>
  );
};

export default UserProfile;
