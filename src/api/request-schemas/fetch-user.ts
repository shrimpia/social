import { z } from "zod";

export const fetchUserRequestSchema = z.object({
    userId: z.string(),
});
