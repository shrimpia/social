import { z } from "zod";

export const createNoteRequestSchema = z.object({
    text: z.string(),
});

export type CreateNoteRequest = z.infer<typeof createNoteRequestSchema>;
