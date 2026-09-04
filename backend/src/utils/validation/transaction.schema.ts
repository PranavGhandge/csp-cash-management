import { z } from "zod";

export const createTransactionSchema = z.object({
    bank_id: z.string().uuid(),

    customer_name: z
        .string()
        .trim()
        .min(2, "Customer name is required"),

    transaction_type: z.enum([
        "WITHDRAWAL",
        "DEPOSIT"
    ]),

    amount: z
        .number()
        .positive("Amount must be greater than 0"),

    note_500: z.number().int().min(0).default(0),
    note_200: z.number().int().min(0).default(0),
    note_100: z.number().int().min(0).default(0),
    note_50: z.number().int().min(0).default(0),
    note_20: z.number().int().min(0).default(0),
    note_10: z.number().int().min(0).default(0)
});