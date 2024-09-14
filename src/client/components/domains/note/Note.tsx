import React, { useMemo } from "react";
import type { Note as NoteType } from "../../../../api/models/note";

import styles from './Note.module.scss';
import { MfmView } from "../../common/MfmView";
import dayjs from "dayjs";
import ShrimpSolid from "../../common/ShrimpSolid";
import { Button } from "../../ui/Button";
import { trpc } from "@/client/api";
import { useSnapshot } from "valtio";
import { sessionState } from "@/client/states/session";

export type NoteProp = {
    note: NoteType;
    onDelete?: (note: NoteType) => void;
};

export const Note: React.FC<NoteProp> = (p) => {
    const session = useSnapshot(sessionState);

    const appearNote = useMemo(() => p.note.renote ? p.note.renote: p.note, [p.note]);
    
    const avatarFgColor = useMemo(() => appearNote.author.personalColor ?? 'var(--card-text)', [appearNote.author.personalColor]);
    const avatarBgColor = useMemo(() => `color-mix(in srgb, ${avatarFgColor}, 80% white)` , [avatarFgColor]);

    const canDelete = useMemo(() => {
        return appearNote.author.id === session.userCache?.id || session.userCache?.role === 'Admin';
    }, [appearNote.author.id, session.userCache]);

    const renote = () => {
        if (!confirm('本当にリノートしますか？')) return;
        trpc.renote.mutate({
            noteId: appearNote.id,
        });
    }

    const deleteNote = () => {
        if (!confirm('本当に削除しますか？')) return;
        trpc.deleteNote.mutate({
            noteId: appearNote.id,
        });
    }

    const undoRenote = () => {
        trpc.deleteNote.mutate({
            noteId: p.note.id,
        });
    }

    const steal = () => {
        if (!appearNote.text) return;
        if (!confirm('このノートをパクリますか？')) return;
        trpc.createNote.mutate({
            text: appearNote.text,
        });
    }

    return (
        <div className={styles.card}>
            {p.note.renote && (
                <div className={styles.renoteDisplay}>
                    <i className="ti ti-repeat _icon-horizontal" />
                    <span style={{color: p.note.author.personalColor ?? 'inherit'}}>
                        {p.note.author.name || p.note.author.username}
                    </span>
                    さんのリノート
                </div>
            )}
            <div className={styles.noteContainer}>
                <div>
                    <div className={styles.avatarBg} style={{backgroundColor: avatarBgColor}}>
                        <ShrimpSolid fill={avatarFgColor} />
                    </div>
                </div>
                <div className={styles.body}>
                    <header className={styles.author}>
                        <div className={styles.name} style={{color: appearNote.author.personalColor ?? 'inherit'}}>
                            {appearNote.author.name}
                        </div>
                        <div className={styles.acct}>
                            @{appearNote.author.username}
                        </div>
                        <div className={styles.timestamp}>
                            {dayjs(appearNote.createdAt).fromNow()}
                        </div>
                    </header> 
                    <main>
                        {appearNote.text && <MfmView>{appearNote.text}</MfmView>}
                    </main>
                    {session.userCache && (
                        <div className={styles.commands}>
                            {p.note.renote && p.note.authorId === session.userCache?.id ? (
                                <Button variant="flat" onClick={undoRenote}>
                                    <i className="ti ti-repeat-off _text-primary" />
                                </Button>
                            ) : (
                                <Button variant="flat" onClick={renote}>
                                    <i className="ti ti-repeat" />
                                </Button>
                            )}
                            <Button variant="flat" onClick={steal}>
                                <i className="ti ti-swipe" />
                            </Button>
                            {canDelete ? (
                                <Button variant="flat" onClick={deleteNote}>
                                    <i className="ti ti-trash _text-primary" />
                                </Button>
                            ) : (
                                <Button variant="flat" disabled>
                                    <i className="ti ti-trash-off _text-muted" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};