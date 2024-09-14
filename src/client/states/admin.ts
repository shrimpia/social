import { proxy } from "valtio";
import { trpc } from "../api";
import type { User } from "@/api/models/user";
import { subscribeKey } from "valtio/utils";

export type TimelineSource = 'local';

export const adminState = proxy({
    users: [] as User[],
    filter: null as string | null,
    cursor: null as string | null,
    hasMore: true,
});

export const initUsers = async () => {
    adminState.cursor = null;
    adminState.hasMore = true;
    adminState.users = [];
    await fetchUsers();
}

export const fetchUsers = async () => {
    await trpc.fetchUsers.query({
        cursor: adminState.cursor,
        limit: 11,
        filter: adminState.filter,
    }).then((users) => {
        if (users.length < 11) {
            adminState.hasMore = false;
            adminState.users.push(...users);
            return;
        }
        const last = users.pop();
        adminState.cursor = last?.id ?? null;
        adminState.users.push(...users);
    })
};

subscribeKey(adminState, 'filter', () => {
    adminState.cursor = null;
    adminState.hasMore = true;
    adminState.users = [];
    fetchUsers();
});

