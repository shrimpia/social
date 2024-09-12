import React from "react";
import type { Note as NoteType } from "../../../../api/models/note";

import styles from './Note.module.scss';
import { MfmView } from "../../common/MfmView";
import dayjs from "dayjs";
import ShrimpSolid from "../../common/ShrimpSolid";
import { Button } from "../../ui/Button";
import { trpc } from "@/client/api";

export type NoteProp = {
    note: NoteType;
    onDelete?: (note: NoteType) => void;
};

export const Note: React.FC<NoteProp> = (p) => {
    const avatarFgColor = p.note.author.personalColor ?? 'var(--card-text)';
    const avatarBgColor = `color-mix(in srgb, ${avatarFgColor}, 80% white)`;

    const del = () => {
        if (!confirm('本当に削除しますか？')) return;
        trpc.deleteNote.mutate({
            noteId: p.note.id,
        });
    }

    return (
        <div className={styles.card}>
            <div>
                <div className={styles.avatarBg} style={{backgroundColor: avatarBgColor}}>
                    <ShrimpSolid fill={avatarFgColor} />
                </div>
            </div>
            <div className={styles.body}>
                <header className={styles.author}>
                    <div className={styles.name} style={{color: p.note.author.personalColor ?? 'inherit'}}>
                        {p.note.author.name}
                    </div>
                    <div className={styles.acct}>
                        @{p.note.author.username}
                    </div>
                    <div className={styles.timestamp}>
                        {dayjs(p.note.createdAt).fromNow()}
                    </div>
                </header> 
                <main>
                    <MfmView>{p.note.text}</MfmView>
                </main>
                <div className={styles.commands}>
                    <Button variant="flat">
                        <i className="ti ti-repeat"></i>
                    </Button>
                    <Button variant="flat" onClick={() => p.onDelete?.(p.note)} onClick={del}>
                        <i className="ti ti-trash _text-primary"></i>
                    </Button>
                </div>
            </div>
        </div>
    );
};