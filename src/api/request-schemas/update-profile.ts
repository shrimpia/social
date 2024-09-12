import { z } from "zod";

export const updateProfileRequestSchema = z.object({
    name: z.string().min(0).max(100).nullable().optional(),
    personalColor: z.string().min(0).max(100).regex(/^#[0-9a-fA-F]{6}$/).nullable().optional(),
});
