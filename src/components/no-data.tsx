"use client";

import { Flex, Text } from "@radix-ui/themes";
import { Inbox } from "lucide-react";

interface NoDataProps {
  label?: string;
}

const NoData = ({ label = "No data found" }: NoDataProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="3"
      className="min-h-[160px]"
    >
      <div
        className="w-13 h-13 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #efc1b1 0%, #d68467 100%)",
        }}
      >
        <Inbox size={20} color="white" />
      </div>
      <Text
        style={{
          fontSize: "13px",
          color: "#9ca3af",
          fontWeight: 500,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Text>
    </Flex>
  );
};

export { NoData };
