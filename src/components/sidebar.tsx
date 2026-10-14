"use client";

import { Box, Flex } from "@radix-ui/themes";
import { LogOut, Shield } from "lucide-react";
import { cn } from "@/utiils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  USER_HEADER_LINKS,
  ADMIN_HEADER_LINKS,
  USER_DROPDOWN,
  ADMIN_DROPDOWN,
  AUTH,
} from "@/constants";

interface SidebarProps {
  type: "user" | "admin";
}

const Sidebar = ({ type }: SidebarProps) => {
  const pathname = usePathname();
  useSession();

  const links = type === "admin" ? ADMIN_HEADER_LINKS : USER_HEADER_LINKS;
  const bottomLinks = type === "admin" ? ADMIN_DROPDOWN : USER_DROPDOWN;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: AUTH });
  };

  return (
    <Box
      className={cn(
        "h-screen w-[240px] flex flex-col border-r relative flex-shrink-0",
        type === "admin"
          ? "bg-[#0f172a] border-[#1e293b]"
          : "bg-white border-gray-200",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "h-16 flex items-center px-5 gap-2",
          type === "admin"
            ? "border-b border-[#1e293b]"
            : "border-b border-gray-200",
        )}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor:
              type === "admin" ? "rgba(255,255,255,0.2)" : "#D97757",
          }}
        >
          <Shield
            size={16}
            className={type === "admin" ? "text-white" : "text-white"}
          />
        </div>
        <span
          className={cn(
            "text-[17px] font-bold leading-tight whitespace-nowrap",
            type === "admin" ? "text-white" : "text-black",
          )}
        >
          MSCAN{" "}
          <span
            style={{
              color: type === "admin" ? "rgba(255,255,255,0.8)" : "#D97757",
            }}
          >
            ANALYZER
          </span>
        </span>
      </div>

      {/* Main Nav Links */}
      <Flex direction="column" gap="1" className="mt-3 px-3 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 mt-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                type === "admin"
                  ? isActive
                    ? "bg-[#1e293b] text-white"
                    : "text-slate-200 hover:bg-[#1e293b] hover:text-white"
                  : isActive
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
              style={
                isActive
                  ? {
                      backgroundColor:
                        type === "admin" ? "rgba(0,0,0,0.15)" : "#D97757",
                    }
                  : {}
              }
            >
              {link.label}
            </Link>
          );
        })}
      </Flex>

      {/* Bottom section */}
      <Box
        className={cn(
          "px-3 py-4 flex flex-col gap-1",
          type === "admin"
            ? "border-t border-[#1e293b]"
            : "border-t border-gray-200",
        )}
      >
        {bottomLinks.map((option) => {
          const isActive = pathname === option.href;
          return (
            <Link
              key={option.href}
              href={option.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                type === "admin"
                  ? isActive
                    ? "bg-[#1e293b] text-white"
                    : "text-slate-200 hover:bg-[#1e293b] hover:text-white"
                  : isActive
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
              style={
                isActive
                  ? {
                      backgroundColor:
                        type === "admin" ? "rgba(0,0,0,0.15)" : "#D97757",
                    }
                  : {}
              }
            >
              {option.label}
            </Link>
          );
        })}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left mt-1",
            type === "admin"
              ? "text-slate-200 hover:bg-red-700 hover:text-white"
              : "text-red-500 hover:bg-red-50",
          )}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </Box>
    </Box>
  );
};

export { Sidebar };
