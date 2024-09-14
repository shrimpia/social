import { z } from "zod";
import { withPaginationSchema } from "./with-pagination";

export const fetchUsersRequestSchema = withPaginationSchema.extend({
    filter: z.string().nullable().optional(),
});