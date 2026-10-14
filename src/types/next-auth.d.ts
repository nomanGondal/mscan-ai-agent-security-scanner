import "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    _id?: string
    username?: string
    fullName?: string
    isUserVerified?: boolean
    isActive?: boolean
    role: string
  }

  interface Session {
    user: {
      _id: string
      username?: string
      fullName?: string
      isUserVerified?: boolean
      isActive?: boolean
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string
    username?: string
    fullName?: string
    isUserVerified?: boolean
    isActive?: boolean
    role?: string
  }
}
