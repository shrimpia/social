import React from "react";
import { NavLink } from "react-router-dom";

import styles from './Sidebar.module.scss';

export type NavItemProp = {
    to?: string;
    href?: string;
    iconClassName: string;
    label: string;
};

export const NavItem: React.FC<NavItemProp> = (p) => {
    const inner = (
        <>
            <i className={p.iconClassName} />
            {p.label}
        </>
    );

    return p.to ? (
        <NavLink to={p.to} role="button" className={p => `${styles.navItem} ${p.isActive ? styles.navItemActive : ''}`}>
            {inner}
        </NavLink>
    ) : p.href ? (
        <a href={p.href} role="button" className={styles.navItem}>
            {inner}
        </a>
    ) : (
        <div className={styles.navItem}>
            {inner}
        </div>
    );
};