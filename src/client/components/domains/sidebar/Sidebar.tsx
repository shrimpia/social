import React from 'react';
import styles from './Sidebar.module.scss';

import shrimpiaLogo from '@/client/assets/shrimpia.png';
import { NavItem } from './NavItem';
import { TITLE } from '@/client/const';
import { useSnapshot } from 'valtio';
import { uiState } from '@/client/states/ui';

export const Sidebar = () => {
    const ui = useSnapshot(uiState);
    return (
        <div className={ui.sidebar.isOpen ? styles.backdropActive : styles.backdrop} onClick={() => uiState.sidebar.isOpen = false}>
            <div className={ui.sidebar.isOpen ? styles.sidebarActive : styles.sidebar} onClick={e => e.stopPropagation()}>
                <h1 className={styles.header}>
                    <img className={styles.logo} src={shrimpiaLogo} alt="Shrimpia" />
                    {TITLE}
                </h1>

                <nav className={styles.navigation} onClick={() => uiState.sidebar.isOpen = false}>
                    <NavItem to="/" iconClassName="ti ti-home" label="タイムライン" />
                    <NavItem to="/settings" iconClassName="ti ti-settings" label="設定" />
                </nav>

                <footer className={styles.footer}>
                    (C)2024 Shrimpia Network <br/>
                </footer>
            </div>
        </div>
    );
};