import { type ReactNode } from "react";
import Header from "../_components/layouts/header";

const ComparisionLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header
        removeBackground
        headerExtraStyle="bg-transparent absolute top-0 left-0 right-0 z-50"
      />
      {children}
    </>
  );
};

export default ComparisionLayout;
