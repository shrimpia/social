import { z } from "zod";

export const suspendUserRequestSchema = z.object({
    userId: z.string(),
});

export type SuspendUserRequest = z.infer<typeof suspendUserRequestSchema>;

