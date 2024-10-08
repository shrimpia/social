import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Form, FormItem, SubmitButton } from "../components/ui/Form";
import { Button } from "../components/ui/Button";
import { sessionState } from "../states/session";
import type { User } from "@/api/models/user";
import { useSnapshot } from "valtio";
import { Input } from "../components/ui/Input";
import { trpc } from "../api";
import { resetTimeline } from "../states/timeline";

type Draft = Omit<User, "username" | "id">;

export default (() => {
    const session = useSnapshot(sessionState);
    const [draftUser, setDraftUser] = useReducer((prev: Draft, next: Partial<Draft>) => ({ ...prev, ...next }), session.userCache ?? {
        name: null,
        personalColor: null,
    } as Draft);

    const saveProfile = () => {
        trpc.updateProfile.mutate(draftUser).then((u) => {
            sessionState.userCache = u;
            resetTimeline();
            alert("プロフィールを更新しました！");
        });
    };

    const logout = () => {
        if (!confirm("このアカウントからログアウトし、トップページに戻ります。\nよろしいですか？")) return;
        sessionState.token = null;
        location.href = "/";
    };

    return (
        <div>
            <h1 className="_page-header">設定</h1>
            <div className="_vstack">
                {session.userCache !== null && (
                    <article className="_card">
                        <h1>プロフィール</h1>
                        <Form>
                            <FormItem label="名前">
                                <Input type="text" value={draftUser.name ?? ""} onChange={(e) => setDraftUser({ name: e.target.value })} />
                            </FormItem>
                            <FormItem label="色">
                                <div className="_hstack">
                                    <Input type="color" value={draftUser.personalColor ?? ""} onChange={(e) => setDraftUser({ personalColor: e.target.value })} />
                                </div>
                            </FormItem>
                            <div>
                                <Button onClick={saveProfile}>
                                    保存
                                </Button>
                            </div>
                        </Form>
                    </article>
            )}
                <div>
                    <Button type="button" variant="primary" onClick={logout}>
                            <i className="ti ti-power" /> ログアウト
                    </Button>
                </div>
            </div>
        </div>
    );
}) as React.FC;