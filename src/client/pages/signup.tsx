import React, { useCallback, useState } from "react";
import { Form, FormItem, SubmitButton } from "../components/ui/Form";
import { Input } from "../components/ui/Input";
import { trpc } from "../api";

export default (() => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const submit = useCallback(async () => {
        try {
            await trpc.createAccountForTesting.mutate({
                username,
                password,
            });
        } catch (e) {
            if (e instanceof Error) {
                alert(e.message);
            }
            console.error(e);
        }
    }, [username, password]);

    return (
        <div>
            <h1 className="_page-header">Sign Up</h1>
            <Form>
                <FormItem label="ユーザー名">
                    <Input type="text" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
                </FormItem>
                <FormItem label="パスワード">
                    <Input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
                </FormItem>
                <SubmitButton onClick={submit}>
                    新規登録
                </SubmitButton>
            </Form>
        </div>
    );
}) as React.FC;