import type { AppRouter } from "@/api/router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

export const api = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/api',
        }),
    ]
});
