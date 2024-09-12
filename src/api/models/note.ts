import { z } from "zod";
import { userSchema } from "./user";

export const noteWithoutChildSchema = z.object({
    id: z.string(),
    text: z.string().nullable(),
    author: userSchema,
    authorId: z.string(),
    createdAt: z.date(),
    inReplyToId: z.string().nullable(),
    renoteId: z.string().nullable(),
});

export type NoteWithoutChild = z.infer<typeof noteWithoutChildSchema>;


export const noteSchema = noteWithoutChildSchema.extend({
    inReplyTo: noteWithoutChildSchema.nullable(),
    renote: noteWithoutChildSchema.nullable(),
});

export type Note = z.infer<typeof noteSchema>;

