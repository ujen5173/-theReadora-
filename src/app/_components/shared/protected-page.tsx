import { redirect } from "next/navigation";
import React from "react";
import { auth } from "~/server/auth";

const ProtectedPage = async ({ children }: { children: React.ReactNode }) => {
  const user = await auth();

  if (!user?.user) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
};

export default ProtectedPage;
