import { type ReactNode } from "react";
import Header from "../_components/layouts/header";

const ContestLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header full removeBackground />
      {children}
    </>
  );
};

export default ContestLayout;
