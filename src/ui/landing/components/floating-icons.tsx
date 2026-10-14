"use client";

import { Server, Shield, Zap } from "lucide-react";

const FloatingIcons = () => {
  return (
    <>
      <div
        className="hidden sm:flex fixed top-[12%] left-[8%] w-12 h-12 backdrop-blur-lg rounded-xl animate-float-slow items-center justify-center shadow-sm pointer-events-none z-50"
        style={{ backgroundColor: "rgba(217,119,87,0.12)" }}
      >
        <Shield className="w-6 h-6" style={{ color: "#D97757" }} />
      </div>

      <div
        className="hidden sm:flex fixed top-[16%] right-[8%] w-12 h-12 backdrop-blur-lg rounded-xl animate-float-medium items-center justify-center shadow-sm pointer-events-none z-50"
        style={{ backgroundColor: "rgba(217,119,87,0.08)" }}
      >
        <Server className="w-6 h-6" style={{ color: "#c4603a" }} />
      </div>

      <div
        className="hidden sm:flex fixed bottom-[20%] left-[12%] w-12 h-12 backdrop-blur-lg rounded-xl animate-float-fast items-center justify-center shadow-sm pointer-events-none z-50"
        style={{ backgroundColor: "rgba(217,119,87,0.15)" }}
      >
        <Zap className="w-6 h-6" style={{ color: "#D97757" }} />
      </div>
    </>
  );
};

export { FloatingIcons };
