import { UserModel } from "@/entities/user.model";
import { connect_db } from "@/settings";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MAX_AGE } from "@/constants";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[CREDENTIALS] authorize() called");

        if (!credentials) {
          console.log("[CREDENTIALS] No credentials provided — returning null");
          return null;
        }

        console.log("[CREDENTIALS] Identifier:", credentials.identifier);

        await connect_db();
        console.log("[CREDENTIALS] DB connected");

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        });

        if (!user) {
          console.log(
            "[CREDENTIALS] User not found for:",
            credentials.identifier,
          );
          return null;
        }

        console.log("[CREDENTIALS] User found:", {
          id: user._id,
          email: user.email,
          isUserVerified: user.isUserVerified,
        });

        if (!user.isUserVerified) {
          console.log("[CREDENTIALS] User not verified — returning null");
          return null;
        }

        const isPasswordMatched = await bcrypt.compare(
          credentials.password,
          user.password ?? "",
        );

        console.log("[CREDENTIALS] Password match result:", isPasswordMatched);

        if (!isPasswordMatched) {
          console.log("[CREDENTIALS] Password mismatch — returning null");
          return null;
        }

        console.log("[CREDENTIALS] Auth successful for:", user.email);

        return {
          id: user._id.toString(),
          username: user.username,
          fullName: user.fullName,
          isUserVerified: user.isUserVerified,
          isActive: user.isActive,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connect_db();
          console.log("[SIGNIN CB] DB connected for Google sign-in");

          const existingUser = await UserModel.findOne({ email: user.email });
          console.log("[SIGNIN CB] Existing user found:", !!existingUser);

          if (!existingUser) {
            const username = `${user.email?.split("@")[0]}_${Date.now()}`;
            console.log(
              "[SIGNIN CB] Creating new user with username:",
              username,
            );

            await new UserModel({
              email: user.email,
              fullName: user.name,
              username,
              isUserVerified: true,
              isActive: true,
              role: "user",
              password: `google_oauth_${user.id}`,
              verificationCodeExpiry: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000,
              ),
            }).save();

            console.log("[SIGNIN CB] New Google user created successfully");
          } else if (!existingUser.role) {
            console.log(
              "[SIGNIN CB] Existing user missing role — updating to 'user'",
            );
            await UserModel.updateOne({ email: user.email }, { role: "user" });
            console.log("[SIGNIN CB] Role updated");
          } else {
            console.log(
              "[SIGNIN CB] Existing user already has role:",
              existingUser.role,
            );
          }

          return true;
        } catch (error) {
          console.error("[SIGNIN CB] Google sign-in error:", error);
          return false;
        }
      }

      console.log("[SIGNIN CB] Non-Google provider — returning true");
      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        await connect_db();

        const dbUser = await UserModel.findOne({ email: token.email });
        console.log("[JWT CB] DB user found:", !!dbUser);

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.fullName = dbUser.fullName;
          token.isUserVerified = dbUser.isUserVerified;
          token.isActive = dbUser.isActive;
          token.role = dbUser.role;
          console.log("[JWT CB] Token enriched with DB user data:", {
            id: token.id,
            username: token.username,
          });
        } else {
          console.warn("[JWT CB] DB user NOT found for email:", token.email);
        }

        return token;
      }

      if (user) {
        console.log("[JWT CB] Credentials user — enriching token");
        token.id = user.id;
        token.username = user.username;
        token.isUserVerified = user.isUserVerified;
        token.fullName = user.fullName;
        token.isActive = user.isActive;
        token.role = user.role;
        console.log("[JWT CB] Token enriched:", {
          id: token.id,
          username: token.username,
        });
      }

      return token;
    },

    async session({ session, token }) {
      console.log("[SESSION CB] Building session for token id:", token.id);

      session.user = {
        _id: token.id as string,
        username: token.username as string,
        isUserVerified: token.isUserVerified as boolean,
        fullName: token.fullName as string,
        isActive: token.isActive as boolean,
        role: token.role as string,
      };

      return session;
    },
  },

  session: { strategy: "jwt", maxAge: MAX_AGE },
  pages: { signIn: "/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};

export { authOptions };
