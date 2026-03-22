import { z } from "zod";

export const bookingRequestSchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guestCount: z.coerce.number().int().min(1).max(20),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  message: z.string().max(500).optional(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
