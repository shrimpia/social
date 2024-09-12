import React, { type PropsWithChildren } from "react";

import styles from './DefaultLayout.module.scss';
import { TopBar } from "../domains/topbar/TopBar";
import { Sidebar } from "../domains/sidebar/Sidebar";

export const DefaultLayout: React.FC<PropsWithChildren> = (p) => {
    return (
        <>
            <main className={styles.main}>
                <TopBar />
                <Sidebar />
                <div className={styles.inner}>
                    {p.children}
                </div>
            </main>
        </>
    );
};