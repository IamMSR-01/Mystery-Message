import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "User must be atleast 3 character")
  .max(20, "User does not contain more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "User does not contain any special character")



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be atleast 6 character"})
})