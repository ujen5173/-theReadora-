import { api } from "~/trpc/server";
import ProfileWrapper from "../_components/layouts/profile/wrapper";
import ProfileMetaData from "../_components/layouts/profile/profile-meta-data";
import Header from "../_components/layouts/header";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { username: string };
}): Promise<Metadata> {
  const user = await api.user.getUserDetails({
    usernameOrId: searchParams.username,
  });

  return {
    title: `${user.name} (@${user.username}) | Readora`,
    description: user.bio || `Check out ${user.name}'s profile on Readora`,
  };
}

const UserProfile = async ({
  searchParams,
}: {
  searchParams: Promise<{ user_id: string }>;
}) => {
  const { user_id } = await searchParams;

  console.log({ user_id });

  const userDetails = await api.user.getUserDetails({
    usernameOrId: user_id,
  });

  console.log({ userDetails });

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
          {/* Tab Contents will go here */}
        </ProfileWrapper>
      </main>
    </>
  );
};

export default UserProfile;
