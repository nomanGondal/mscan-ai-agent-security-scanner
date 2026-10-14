"use client";

import { AUTH, ADMIN_DROPDOWN, USER_DROPDOWN } from "@/constants";
import { Box } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

interface DashboardHeaderProps {
  type: "user" | "admin";
}

const DashboardHeader = ({ type }: DashboardHeaderProps) => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountPlan, setAccountPlan] = useState<string | null>(null);

  const dropdownOptions = type === "admin" ? ADMIN_DROPDOWN : USER_DROPDOWN;
  const avatarLetter = session?.user?.username?.[0]?.toUpperCase() || "U";
  const username = session?.user?.username || "User";

  useEffect(() => {
    if (type !== "user") {
      return;
    }

    let isMounted = true;

    const loadAccountPlan = async () => {
      try {
        const response = await fetch("/api/account/account-details", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          success?: boolean;
          data?: { plan?: string };
        };

        if (isMounted && payload?.success && payload.data?.plan) {
          setAccountPlan(payload.data.plan);
        }
      } catch (error) {
        console.error("Failed to load account plan:", error);
      }
    };

    void loadAccountPlan();

    return () => {
      isMounted = false;
    };
  }, [type]);

  const plan =
    type === "user"
      ? accountPlan
        ? `${accountPlan.charAt(0).toUpperCase()}${accountPlan.slice(1)}`
        : "Free"
      : null;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: AUTH });
  };

  return (
    <Box className="w-full flex items-center justify-end gap-3 px-4 sm:px-8 py-[10.7px] bg-white border-b border-gray-200">
      <Box className="flex items-center gap-3 relative">
        <Box className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-black leading-tight">
            {username}
          </p>
          {plan && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {plan} Plan
            </span>
          )}
        </Box>

        <Box className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold transition"
            style={{ backgroundColor: "#D97757" }}
          >
            {avatarLetter}
          </button>

          {dropdownOpen && (
            <Box className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
              <Box className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-black">{username}</p>
                <p className="text-xs text-gray-500 break-all">
                  {session?.user?.email}
                </p>
              </Box>

              {dropdownOptions.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-black transition border-b border-gray-100 last:border-b-0"
                  onClick={() => setDropdownOpen(false)}
                >
                  {option.label}
                </Link>
              ))}

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition font-medium"
              >
                Sign Out
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { DashboardHeader };
