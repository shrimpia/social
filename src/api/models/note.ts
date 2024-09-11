import { z } from "zod";
import { userSchema } from "./user";

export const noteSchema = z.object({
    id: z.string(),
    text: z.string(),
    author: userSchema,
    authorId: z.string(),
});
