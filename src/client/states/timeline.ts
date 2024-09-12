import { proxy } from "valtio";
import { trpc } from "../api";
import { Note } from "@/api/models/note";

export type TimelineSource = 'local';

export const timelineState = proxy({
    notes: [] as Note[],
    source: 'local' as TimelineSource,
    cursor: null as string | null,
    hasMore: true,
});

export const resetTimeline = async () => {
    timelineState.notes = [];
    timelineState.cursor = null;
    timelineState.hasMore = true;
    await fetchTimeline();
}

export const fetchTimeline = async () => {
    await trpc.fetchLocalTimeline.query({
        cursor: timelineState.cursor,
        limit: 11,
    }).then((notes) => {
        if (notes.length < 11) {
            timelineState.hasMore = false;
            timelineState.notes.push(...notes);
            return;
        }
        const last = notes.pop();
        timelineState.cursor = last?.id ?? null;
        timelineState.notes.push(...notes);
    })
};

fetchTimeline();
