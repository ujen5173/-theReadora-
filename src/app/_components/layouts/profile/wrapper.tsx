"use client";

import React, { useLayoutEffect } from "react";
import {
  useUserProfileStore,
  type ExtendedUser,
} from "~/store/userProfileStore";

const ProfilelWrapper = ({
  children,
  details,
}: {
  children: React.ReactNode;
  details: ExtendedUser;
}) => {
  const { setUser } = useUserProfileStore();

  useLayoutEffect(() => {
    setUser(details);
  }, [details]);

  return <>{children}</>;
};

export default ProfilelWrapper;
