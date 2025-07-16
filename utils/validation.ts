import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or more"),
});

export const addSlotSchema = z.object({
  dates: z.array(
    z.object({
      date: z.string().refine((d) => !isNaN(Date.parse(d)), {
        message: "Invalid date",
      }),
      timeSlots: z.array(z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format")),
    })
  ),
});