import type { AppRouter } from "@/api/router";
import { createTRPCClient, createWSClient, httpBatchLink, splitLink, wsLink } from "@trpc/client";
import { sessionState } from "./states/session";
import superjson from "superjson";


const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
const host = location.host;

const wsClient = createWSClient({
    url: `${protocol}://${host}/api`,
});

const http = httpBatchLink({
    url: '/api',
    headers() {
        if (!sessionState.token) return {};

        return {
            'X-Api-Token': sessionState.token,
        };
    },
    transformer: superjson,
});

const websocket = wsLink({
    client: wsClient,
    transformer: superjson,
});

export const trpc = createTRPCClient<AppRouter>({
    links: [
        splitLink({
            condition: op => op.type === 'subscription',
            true: websocket,
            false: http,
        })
    ]
});
