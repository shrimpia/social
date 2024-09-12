import React from "react";

import shrimpiaLogo from '../../../assets/shrimpia.png';
import styles from './TopBar.module.scss';
import { Link } from "react-router-dom";
import { TITLE } from "@/client/const";

export const TopBar: React.FC = () => {
    return (
        <header className={styles.topBar}>
            <Link to="/" className={styles.topLink}>
                <img src={shrimpiaLogo} className={styles.logo} alt="" />
                {TITLE}
            </Link>
        </header>
    );
};