import React from "react";

const ScannerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <main>{children}</main>
    </div>
  );
};

export default ScannerLayout;
