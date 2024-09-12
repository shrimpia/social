import type { AppRouter } from "@/api/router";
import { createTRPCClient, createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { sessionState } from "./states/session";
import superjson from "superjson";

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/api',
            headers() {
                if (!sessionState.token) return {};

                return {
                    'X-Api-Token': sessionState.token,
                };
            },
            transformer: superjson,
        }),
    ]
});
