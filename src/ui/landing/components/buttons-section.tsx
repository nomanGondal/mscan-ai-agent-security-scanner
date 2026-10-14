"use client";

import { RightArrow } from "@/components";
import { Button } from "@/components/ui/button";
import { REGISTRATION } from "@/constants";
import { Box } from "@radix-ui/themes";
import Link from "next/link";

const ButtonSection = () => {
  return (
    <Box className="w-full mt-8 sm:mt-10 flex justify-center items-center pt-2 px-4 sm:px-0">
      <Box className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <Link href="/about">
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-full cursor-pointer shadow-sm border-gray-200 text-gray-700 hover:border-[#D97757] hover:text-[#D97757] transition-colors duration-200 px-6"
          >
            Documentation
          </Button>
        </Link>

        <Link href={REGISTRATION}>
          <Button
            className="w-full sm:w-auto rounded-full font-normal px-6 cursor-pointer shadow-md transition-opacity duration-200 hover:opacity-90"
            style={{ backgroundColor: "#D97757", color: "#1F1F1E" }}
          >
            Get Started
            <RightArrow />
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ButtonSection;
