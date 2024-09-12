import React from 'react';
import styles from './Sidebar.module.scss';

import shrimpiaLogo from '@/client/assets/shrimpia.png';
import { NavItem } from './NavItem';
import { TITLE } from '@/client/const';

export const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h1 className={styles.header}>
                <img className={styles.logo} src={shrimpiaLogo} alt="Shrimpia" />
                {TITLE}
            </h1>

            <nav className={styles.navigation}>
                <NavItem to="/" iconClassName="ti ti-home" label="タイムライン" />
                <NavItem to="/settings" iconClassName="ti ti-settings" label="設定" />
            </nav>

            <footer className={styles.footer}>
                (C)2024 Shrimpia Network <br/>

            </footer>
        </div>
    );
};