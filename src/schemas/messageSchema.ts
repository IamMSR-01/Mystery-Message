import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be atleast of 10 character" })
    .max(300, { message: "content must be no longer then of 10 character" })
});
