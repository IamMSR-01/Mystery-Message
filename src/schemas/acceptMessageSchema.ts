import { z } from "zod";

export const acceptMessageSchema = z.object({
  acceptingMessages: z.boolean()
});
