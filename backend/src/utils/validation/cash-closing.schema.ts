import { z } from "zod";

export const createCashClosingSchema = z.object({
    note_500: z.number().int().min(0).default(0),
    note_200: z.number().int().min(0).default(0),
    note_100: z.number().int().min(0).default(0),
    note_50: z.number().int().min(0).default(0),
    note_20: z.number().int().min(0).default(0),
    note_10: z.number().int().min(0).default(0)
});