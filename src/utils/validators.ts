import { z } from "zod";

export const emailValidator = z.string().email("Invalid email address");

// ---- Zod Schema for validation ----
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: emailValidator,
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});
