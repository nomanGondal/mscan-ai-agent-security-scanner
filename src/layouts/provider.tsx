import NextTopLoader from "nextjs-toploader";
import React, { PropsWithChildren } from "react";

const ProviderLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NextTopLoader color="#D97757" showSpinner={false} height={3} />
      {children}
    </>
  );
};

export default ProviderLayout;
