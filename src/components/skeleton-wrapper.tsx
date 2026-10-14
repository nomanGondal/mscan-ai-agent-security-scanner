"use client";

import { Flex, Skeleton } from "@radix-ui/themes";

interface SkeletonWrapperProps {
  isLoading: boolean;
  count: number;
  height: string;
  width?: string;
  children?: React.ReactNode;
}

const SkeletonWrapper = ({
  isLoading,
  count,
  height,
  width,
  children,
}: SkeletonWrapperProps) => {
  if (!isLoading) return <>{children}</>;
  return (
    <Flex direction="column" gap="3" className="p-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          height={height}
          width={width ?? "100%"}
          style={{ borderRadius: "10px", opacity: 0.7 }}
        />
      ))}
    </Flex>
  );
};

export { SkeletonWrapper };
