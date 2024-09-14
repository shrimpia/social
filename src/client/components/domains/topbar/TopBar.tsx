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

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <header className={styles.topBar}>
            <Button variant="flat" onClick={openSidebar}>
                <i className="ti ti-menu-2" />
            </Button>
            <Button variant="flat" onClick={scrollToTop} className={styles.topLink}>
                <img src={shrimpiaLogo} className={styles.logo} alt="" />
                {TITLE}
            </Button>
        </header>
    );
};