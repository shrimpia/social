import { z } from "zod";

export const createNoteRequestSchema = z.object({
    text: z.string().min(1).max(1000),
});

export type CreateNoteRequest = z.infer<typeof createNoteRequestSchema>;
