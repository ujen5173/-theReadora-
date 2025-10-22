import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { TGetUserDetails } from "~/server/api/routers/user";
import { api } from "~/trpc/server";
import { generateSEOMetadata } from "~/utils/site";
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

  return generateSEOMetadata({
    title: `${userdata.name} (@${userdata.username})`,
    description: `Explore ${userdata.name}'s profile, works, and activity on Readora.`,
    pathname: `/profile?user=${userdata.username}`,
    type: "profile" as any,
    author: userdata.name ?? userdata.username,
  });
}

const UserProfile = async ({
  searchParams,
}: {
  searchParams: Promise<{ user: string }>;
}) => {
  const { user } = await searchParams;

  let userDetails: TGetUserDetails | null = null;

  try {
    userDetails = await api.user.getUserDetails({
      usernameOrId: user,
    });
  } catch (err) {
    if (
      err instanceof TRPCError &&
      err.message === "Username or ID is required"
    ) {
      redirect("/");
    }
  }

  if (!userDetails) redirect("/");

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
