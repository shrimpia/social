import React, { useEffect } from "react";

import styles from './Timeline.module.scss';
import { trpc } from "@/client/api";
import { Note } from "../note/Note";
import { Button } from "../../ui/Button";
import { useSnapshot } from "valtio";
import { fetchTimeline, timelineState } from "@/client/states/timeline";

export type TimelineProp = {
    source: 'local',
};

export const Timeline: React.FC<TimelineProp> = (p) => {
    const timeline = useSnapshot(timelineState);

    return (
        <div className={styles.timeline}>
            {timeline.notes.map((note) => (
                <Note key={note.id} note={note} />
            ))}
            {timeline.hasMore ? (
                <Button className={styles.readMoreButton} onClick={() => fetchTimeline()}>
                    もっと読む
                </Button>
            ) : (
                <div className={styles.noMoreNotes}>
                    これ以上ノートはありません
                </div>
            )}
        </div>
    );
};