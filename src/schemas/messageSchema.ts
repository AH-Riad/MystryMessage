import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(2, { message: "Content must be at least 2 characters" })
    .max(300, "Content must be no longer than 300 characters"),
});
