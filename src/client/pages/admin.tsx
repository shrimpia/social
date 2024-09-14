import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { adminState, fetchUsers, initUsers } from "../states/admin";
import { Form, FormItem } from "../components/ui/Form";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { User } from "@/api/models/user";
import { trpc } from "../api";

export default (() => {
    const snapshot = useSnapshot(adminState);

    const suspend = async (user: User) => {
        if (!confirm(`${user.username}を凍結しますか？`)) return;
        await trpc.suspendUser.mutate({ userId: user.id });
        await initUsers();
    };

    const unsuspend = async (user: User) => {
        if (!confirm(`${user.username}を凍結解除しますか？`)) return;
        await trpc.unsuspendUser.mutate({ userId: user.id });
        await initUsers();
    }

    return (
        <div>
            <h1>Admin</h1>
            <div className="_vstack">
                <Input type="text" autoComplete="off" value={snapshot.filter ?? ''} onChange={e => { adminState.filter = e.target.value }} placeholder="ユーザー名…" />
                {snapshot.users.map(user => (
                    <div key={user.id} className="_card _vstack">
                        <b style={{color: user.personalColor ?? 'inherit'}}>{user.name ?? user.username} @{user.username}</b>
                        <div>ロール: {user.role}</div>
                        <div>凍結: {user.isSuspended ? 'はい' : 'いいえ'}</div>
                        <div className="_hstack">
                            {user.isSuspended ? (
                                <Button variant="primary" onClick={() => unsuspend(user)}>凍結解除</Button>
                            ) : (
                                <Button variant="primary" onClick={() => suspend(user)}>凍結</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}) as React.FC;