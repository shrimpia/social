import React from "react";
import styles from './Button.module.scss';
import type { UIVariant } from "../../types/ui-variant";

export type ButtonProp = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    variant?: UIVariant;
};

export const Button: React.FC<ButtonProp> = (p) => {
    const className = p.variant === 'primary' ? styles.btnPrimary : styles.btn;

    return (
        <button type="button" {...p} className={className}>
            {p.children}
        </button>
    );
}