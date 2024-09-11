import { z } from "zod";

export const deleteNoteRequestSchema = z.object({
    noteId: z.string(),
});

export type DeleteNoteRequest = z.infer<typeof deleteNoteRequestSchema>;
