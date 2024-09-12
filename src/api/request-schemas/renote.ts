import { z } from "zod";

export const renoteRequestSchema = z.object({
    noteId: z.string(),
});