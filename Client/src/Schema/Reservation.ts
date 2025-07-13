import { z } from "zod";
export const reservationSchema = z.object({
  numberOfPeople: z.number().min(1, "Enter people").max(7, "Max 7 people"),
    table_id: z.string().min(1, "Select a table"),
  date: z.string().min(1, "Choose date"),
  slot: z.string().min(1, "Choose slot"),
});