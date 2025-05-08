import type { Metadata } from "next";
import { api } from "~/trpc/server";
import Header from "../_components/layouts/header";
import ProfileMetaData from "../_components/layouts/profile/profile-meta-data";
import ProfileWrapper from "../_components/layouts/profile/wrapper";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ user_id: string }>;
}): Promise<Metadata> {
  const { user_id } = await searchParams;
  const user = await api.user.getUserDetails({
    usernameOrId: user_id,
  });

  return {
    title: `${user.name} (@${user.username}) | Readora`,
    description: `Check out ${user.name}'s profile on Readora`,
  };
}

const UserProfile = async ({
  searchParams,
}: {
  searchParams: Promise<{ user_id: string }>;
}) => {
  const { user_id } = await searchParams;

  const userDetails = await api.user.getUserDetails({
    usernameOrId: user_id,
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
