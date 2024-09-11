import React from "react";

import shrimpiaLogo from '../../../assets/shrimpia.png';
import styles from './TopBar.module.scss';

export const TopBar: React.FC = () => {
    return (
        <header className={styles.topBar}>
            <img src={shrimpiaLogo} className={styles.logo} alt="" />
            シュリンピア帝国（Re:仮）
        </header>
    );
};