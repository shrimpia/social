import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string().nullable().optional(),
    personalColor: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;
