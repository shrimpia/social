import { z } from "zod";
import { userSchema } from "./user";

export const userWithTokenSchema = userSchema.extend({
    token: z.string(),
});

export type UserWithToken = z.infer<typeof userWithTokenSchema>;
