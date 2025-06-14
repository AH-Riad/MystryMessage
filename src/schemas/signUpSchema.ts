import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(40, "Username must be no more than 40 characters")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9_]{2,39}$/,
    "Username must not contain special characters"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
