import React, { useMemo } from "react";

import styles from './index.module.scss';
import { useSnapshot } from "valtio";
import { sessionState as state } from "../states/session";
import { LoginForm } from "../components/domains/home/LoginForm";
import { PostForm } from "../components/domains/home/PostForm";
import { Timeline } from "../components/domains/home/Timeline";

export default (() => {
    const sessionState = useSnapshot(state);

    return (
        <div className={styles.container}>
            {sessionState.token ? <PostForm /> : <LoginForm />}
            <Timeline source="local" />
        </div>
    );
}) as React.FC;
