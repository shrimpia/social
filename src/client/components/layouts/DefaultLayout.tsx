import React, { type PropsWithChildren } from "react";

import styles from './DefaultLayout.module.scss';
import { TopBar } from "../domains/topbar/TopBar";

export const DefaultLayout: React.FC<PropsWithChildren> = (p) => {
    return (
        <>
            <main className={styles.main}>
                <TopBar />
                <div className={styles.inner}>
                    {p.children}
                </div>
            </main>
        </>
    );
};