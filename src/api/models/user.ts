import { Role } from "@prisma/client";
import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string().nullable().optional(),
    personalColor: z.string().nullable().optional(),
    role: z.nativeEnum(Role),
    isSuspended: z.boolean(),
});

export type User = z.infer<typeof userSchema>;
