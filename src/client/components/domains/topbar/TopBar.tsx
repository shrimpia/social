import React from "react";

import shrimpiaLogo from '../../../assets/shrimpia.png';
import styles from './TopBar.module.scss';
import { Link } from "react-router-dom";
import { TITLE } from "@/client/const";
import { Button } from "../../ui/Button";
import { uiState } from "@/client/states/ui";

export const TopBar: React.FC = () => {
    const openSidebar = () => {
        uiState.sidebar.isOpen = true;
    };

    return (
        <header className={styles.topBar}>
            <Button variant="flat" onClick={openSidebar}>
                <i className="ti ti-menu-2" />
            </Button>
            <img src={shrimpiaLogo} className={styles.logo} alt="" />
            {TITLE}
        </header>
    );
};