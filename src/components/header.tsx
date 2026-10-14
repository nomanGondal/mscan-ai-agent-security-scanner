"use client";

import { AUTH, REGISTRATION } from "@/constants";
import { cn } from "@/utiils";
import { RightArrow } from "./icons/right-arrow";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Box } from "@radix-ui/themes";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const bokorFont = Montserrat({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box className="w-full px-4 sm:px-0 sm:w-4/5 mx-auto">
      {/* Desktop Header */}
      <Box
        className={cn(
          bokorFont.className,
          "border border-gray-200 h-16 flex items-center px-4 text-black rounded-full shadow-md bg-white",
        )}
      >
        {/* Logo */}
        <Box className="flex-1 flex items-center">
          <p className="font-bold text-lg cursor-pointer">
            M<span style={{ color: "#D97757" }}>SCAN</span>.
          </p>
        </Box>

        {/* Nav — hidden on mobile */}
        <Box className="hidden md:flex flex-1 justify-center gap-4 text-sm">
          <Link
            href="/"
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            Contact
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-[#D97757] transition-colors duration-200 focus:outline-none cursor-pointer text-sm">
              More
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-white shadow-lg border border-gray-200 text-black"
            >
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 hover:text-[#D97757]">
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 hover:text-[#D97757]">
                Github
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Box>

        {/* Auth Buttons — hidden on mobile */}
        <Box className="hidden md:flex flex-1 justify-end gap-3">
          <Button
            variant="ghost"
            className="rounded-full text-black hover:text-[#D97757] hover:bg-transparent transition-colors duration-200"
          >
            <Link href={AUTH}>Login</Link>
          </Button>
          <Button
            asChild
            className="px-5 py-2 rounded-full text-white font-medium cursor-pointer transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: "#D97757" }}
          >
            <Box className="flex justify-center items-center gap-1">
              <Link href={REGISTRATION}>
                <Label className="font-normal cursor-pointer">Sign up</Label>
              </Link>
              <RightArrow />
            </Box>
          </Button>
        </Box>

        {/* Hamburger — mobile only */}
        <Box className="flex md:hidden ml-auto">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </Box>
      </Box>

      {/* Mobile Menu */}
      {mobileOpen && (
        <Box
          className={cn(
            bokorFont.className,
            "md:hidden mt-2 bg-white border border-gray-200 rounded-2xl shadow-md px-6 py-4 flex flex-col gap-4 text-black",
          )}
        >
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            Contact
          </Link>
          <Link
            href="#"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            Documentation
          </Link>
          <Link
            href="#"
            onClick={() => setMobileOpen(false)}
            className="hover:text-[#D97757] transition-colors duration-200"
          >
            Github
          </Link>

          <Box className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full rounded-full text-black hover:text-[#D97757] hover:bg-transparent transition-colors duration-200"
            >
              <Link href={AUTH}>Login</Link>
            </Button>
            <Button
              asChild
              className="w-full px-5 py-2 rounded-full text-white font-medium cursor-pointer transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: "#D97757" }}
            >
              <Box className="flex justify-center items-center gap-1">
                <Link href={REGISTRATION}>
                  <Label className="font-normal cursor-pointer">Sign up</Label>
                </Link>
                <RightArrow />
              </Box>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export { Header };
