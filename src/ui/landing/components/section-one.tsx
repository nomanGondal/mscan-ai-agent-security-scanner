"use client";

import { LandingBadge } from "@/components";
import { cn } from "@/utiils";
import { Box, Text } from "@radix-ui/themes";
import { Server, Shield, Zap } from "lucide-react";
import Link from "next/link";

interface SectionOneProps {
  font: string;
}

const SectionOne = ({ font }: SectionOneProps) => {
  return (
    <Box className="w-full overflow-hidden px-4 sm:px-10 md:px-20 mt-0 pt-8 sm:pt-12 flex justify-center items-center text-center flex-col relative">
      <Box
        className="hidden sm:flex absolute top-6 sm:top-10 left-4 sm:left-30 w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-lg rounded-xl animate-float-slow items-center justify-center shadow-lg"
        style={{ backgroundColor: "rgba(217,119,87,0.12)" }}
      >
        <Shield
          className="w-5 h-5 sm:w-6 sm:h-6"
          style={{ color: "#D97757" }}
        />
      </Box>

      <Box
        className="hidden sm:flex absolute top-10 sm:top-20 right-4 sm:right-20 w-10 h-10 sm:w-12 sm:h-12 shadow-lg backdrop-blur-lg rounded-xl animate-float-medium items-center justify-center"
        style={{ backgroundColor: "rgba(217,119,87,0.08)" }}
      >
        <Server
          className="w-5 h-5 sm:w-6 sm:h-6"
          style={{ color: "#c4603a" }}
        />
      </Box>

      <Box
        className="hidden sm:flex absolute bottom-5 left-1/6 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-lg rounded-xl animate-float-fast items-center justify-center shadow-lg"
        style={{ backgroundColor: "rgba(217,119,87,0.15)" }}
      >
        <Zap className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#D97757" }} />
      </Box>

      <LandingBadge />

      <Text
        className={cn(
          "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[600] leading-[1.3] text-center mt-6 relative z-10",
          font,
        )}
      >
        Protect Your{" "}
        <span className="relative inline-block">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #1F1F1E 0%, #D97757 50%, #c4603a 100%)",
            }}
          >
            MCP Agents
          </span>
          <span
            className="absolute left-0 -bottom-1 h-[3px] w-full rounded-full"
            style={{ backgroundColor: "#D97757", opacity: 0.5 }}
          />
        </span>{" "}
        with Automated Vulnerability Scanning Today
      </Text>

      <Text className="mt-6 text-base sm:text-lg text-gray-600 font-normal px-2 sm:px-0">
        Want to see how <span className="font-semibold text-black">MVSCAN</span>{" "}
        works?{" "}
        <Link
          href="#how-it-works"
          className="font-semibold underline transition-colors duration-200"
          style={{ color: "#D97757" }}
        >
          Check it out
        </Link>
      </Text>
    </Box>
  );
};

export { SectionOne };
