"use client";

import { Box } from "@radix-ui/themes";
import UserBoard from "./components/user-board";

const UserProfile = () => {
  return (
    <Box className="h-full w-full flex flex-col">
      <Box className="flex-1">
        <UserBoard />
      </Box>
    </Box>
  );
};

export { UserProfile };
