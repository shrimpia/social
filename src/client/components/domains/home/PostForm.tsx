import React, { useCallback, useMemo, useState } from 'react';
import styles from './PostForm.module.scss';
import { Button } from '../../ui/Button';
import { Textarea } from '../../ui/Textarea';
import { TITLE } from '@/client/const';
import { createNoteRequestSchema } from '@/api/request-schemas/create-note';
import { trpc } from '@/client/api';

export const PostForm: React.FC = () => {
    const [text, setText] = useState("");
    const [isSending, setSending] = useState(false);
    const createNote = trpc.createNote.mutate;

    const chooseVisibility = () => {
        alert(`${TITLE}では、常に全部のノートがパブリックです。\n他者に見られても問題ない内容のみ投稿してください。`);
    };

    const toggleLocalOnly = () => {
        alert(`${TITLE}では、連合機能が実装されていないため、全ての投稿は「連合なし」です！`);
    };

    const remain = useMemo(() => (createNoteRequestSchema.shape.text.maxLength ?? 1000) - text.length, [text.length]);
    const canNote = useMemo(() => !isSending && text.length > 0 && remain > 0, [text.length, remain, isSending]);

    const post = useCallback(async () => {
        try {
            setSending(true);
            await createNote({ text });
            setText("");
        } catch (e) {
            if (e instanceof Error) {
                alert(e.message);
            }
            console.error(e);
        } finally {
            setSending(false);
        }
    }, [createNote, text]);

    return (
        <div className={`_card _vstack ${styles.container}`}>
            <div className={styles.topCommands}>
                <div className={styles.placeholder} />
                <div className={styles.spacer} />            
                <Button variant="flat" onClick={chooseVisibility}><i className="ti ti-world" /> パブリック</Button>
                <Button variant="flat" onClick={toggleLocalOnly}><i className="ti ti-rocket-off _text-primary" /></Button>
                <Button variant="primary" disabled={!canNote} onClick={post}>ノート <i className="ti ti-send" /></Button>
            </div>
            <textarea className={styles.textarea} placeholder="いまどうしてる？" value={text} onChange={e => setText(e.target.value)} />
            {remain < 50 && <div className={styles.remain}>残り{remain}文字</div>}
        </div>
    );
};