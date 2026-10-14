import { ROLE, USER_PERSONA } from "@/constants";
import { z } from "zod";

const usernameGuard = z
  .string()
  // .trim()
  // .regex(/^[a-zA-Z0-9]+$/, {
  //   message: "Username should not have special characters.",
  // })
  .min(4, { message: "Username should be at least 4 characters long." });
const emailGuard = z.email({ message: "Invalid email." });
const passwordGuard = z.string();
// .min(4, { message: "Password must be at least 4 characters long." })
// .regex(/[A-Z]/, {
//   message: "Password must contain at least one uppercase letter.",
// })
// .regex(/[a-z]/, {
//   message: "Password must contain at least one lowercase letter.",
// })
// .regex(/[0-9]/, { message: "Password must contain at least one number." })
const fullNameGuard = z
  .string()
  .min(3, { message: "Full name must be at least 3 characters long." })
  .max(20, { message: "Full name can be up to 20 characters long." });

// const roleGuard = z.enum([ROLE.USER, ROLE.ADMIN] as const)
const personaGuard = z.enum(Object.values(USER_PERSONA) as readonly string[]);

const registrationSchema = z.object({
  username: usernameGuard,
  email: emailGuard,
  password: passwordGuard,
  fullName: fullNameGuard,
  confirmPassword: z.string().min(1, { message: "Confirm password is required." }),
  // role: roleGuard,
  persona: personaGuard,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export { registrationSchema };
