import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or more"),
});