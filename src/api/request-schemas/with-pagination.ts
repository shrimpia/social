import { z } from "zod";

export const withPaginationSchema = z.object({
    cursor: z.string().nullable().optional(),
    limit: z.number().int().positive().default(10),
});
