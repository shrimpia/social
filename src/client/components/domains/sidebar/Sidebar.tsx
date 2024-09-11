import React from 'react';
import styles from './Sidebar.module.scss';

import shrimpiaLogo from '@/client/assets/shrimpia.png';
import { NavItem } from './NavItem';

export const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h1 className={styles.header}>
                <img className={styles.logo} src={shrimpiaLogo} alt="Shrimpia" />
                Shrimpia Portal
            </h1>

            <nav className={styles.navigation}>
                <NavItem to="/" iconClassName="ti ti-home" label="ホーム" />
                <NavItem to="/emoji-request" iconClassName="ti ti-mood-smile" label="絵文字リクエスト" />
                <NavItem to="/events" iconClassName="ti ti-calendar-event" label="イベントカレンダー" />
                <NavItem to="/settings" iconClassName="ti ti-settings" label="設定" />
                <NavItem to="/_debug" iconClassName="ti ti-bug" label="Debug Mode" />
            </nav>

            <div className={styles.commands}>
                <NavItem href="https://mk.shrimpia.network" iconClassName="ti ti-arrow-left" label="シュリンピア帝国へ戻る" />
            </div>
        </div>
    );
};