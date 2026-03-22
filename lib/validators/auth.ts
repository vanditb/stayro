import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
