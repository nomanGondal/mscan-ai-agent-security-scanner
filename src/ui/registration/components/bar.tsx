"use client";

import { Label } from "@/components/ui/label";
import { Box } from "@radix-ui/themes";
import Image from "next/image";
import { UserCheck, Database, Sparkles } from "lucide-react";
import reg from "../../../../public/sreg.png";
import { Button } from "@/components/ui/button";

const Bar = () => {
  return (
    <Box className="relative flex items-center justify-evenly w-[55%] flex-col h-full border-r overflow-hidden">
      <Box className="absolute top-40 left-30 w-12 h-12 bg-purple-400/20 backdrop-blur-lg rounded-xl animate-float-slow flex items-center justify-center shadow-lg">
        <UserCheck className="w-6 h-6 text-purple-700" />
      </Box>
      <Box className="absolute top-20 right-20 w-12 h-12 bg-blue-400/20 backdrop-blur-lg rounded-xl animate-float-medium flex items-center justify-center shadow-lg">
        <Database className="w-6 h-6 text-blue-700" />
      </Box>
      <Box className="absolute bottom-30 left-1/6 -translate-x-1/2 w-12 h-12 bg-fuchsia-400/20 backdrop-blur-lg rounded-xl animate-float-fast flex items-center justify-center shadow-lg">
        <Sparkles className="w-6 h-6 text-fuchsia-700" />
      </Box>
      <Box className="relative z-10 text-center space-y-3">
        <Label className="text-5xl font-bold text-black mr-30 relative bottom-5">
          Welcome to{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
              Signup
            </span>
            <span className="absolute left-0 -bottom-2 h-[3px] w-full rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-gradient" />
          </span>
        </Label>
      </Box>
      <Box className="relative z-10 flex justify-center items-center">
        <Image
          src={reg}
          alt="signup image"
          width={520}
          height={520}
          className="select-none"
          priority
        />
      </Box>
      <Box className="flex items-center justify-center flex-col">
        <Label>Already have an account Login Here.</Label>
        <Button className="w-60 mt-4 rounded-full cursor-pointer bg-black hover:bg-black shadow-md">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export { Bar };
