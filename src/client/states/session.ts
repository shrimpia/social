import { User } from "@/api/models/user";
import { proxy, subscribe } from "valtio";
import { subscribeKey, watch } from "valtio/utils";
import { trpc } from "../api";

export const sessionState = proxy({
    token: localStorage.getItem("rekari_token"),
    userCache: null as User | null,
});

if (sessionState.token) {
    trpc.fetchUserFromToken.query().then(user => {
        sessionState.userCache = user;
    });
}

subscribeKey(sessionState, 'token', t => {
    if (t) {
        localStorage.setItem("rekari_token", t);
        trpc.fetchUserFromToken.query().then(user => {
            sessionState.userCache = user;
        });
    } else {
        localStorage.removeItem("rekari_token");
        sessionState.userCache = null;
    }
});