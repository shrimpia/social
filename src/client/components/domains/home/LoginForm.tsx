import React, { useCallback, useState } from "react";

import styles from './LoginForm.module.scss';
import commonStyles from './FormCommon.module.scss';
import { Form, FormItem, SubmitButton } from "../../ui/Form";
import { Input } from "../../ui/Input";
import { trpc } from "@/client/api";
import { sessionState } from "@/client/states/session";

export const LoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    
    const submit = useCallback(async () => {
        try {
            setSubmitting(true);
            const user = await trpc.login.mutate({
                username,
                password,
            });
            sessionState.token = user.token;
            document.documentElement.scroll(0, 0);
        } catch (e) {
            if (e instanceof Error) {
                alert(e.message);
            }
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    }, [username, password]);

    const disabled = !username || !password || isSubmitting;

    return (
        <div className={commonStyles.container}>
            <div className="_card">
                <p className={styles.description}>
                    シュリンピア帝国のユーザー名・パスワードを入力して、ログインしてください。<br/>
                    9/14 14:10時点のパスワードが反映されているので、パスワードを変更した方は以前のパスワードも試してみてください。
                </p>
                <Form>
                    <FormItem label="ユーザー名">
                        <Input type="text" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </FormItem>
                    <FormItem label="パスワード">
                        <Input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
                    </FormItem>
                    <SubmitButton type="button" disabled={disabled} onClick={submit}>
                        ログイン
                    </SubmitButton>
                </Form>
            </div>
        </div>
    );
};