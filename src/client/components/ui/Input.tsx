import React from "react";
import type { UIVariant } from "../../types/ui-variant";

import styles from './Input.module.scss';

export type InputProp = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    variant?: UIVariant;
};

export const Input: React.FC<InputProp> = (p) => {
    const className = p.variant === 'primary' ? styles.inputPrimary : styles.input;

    return (
        <input type="text" {...p} className={className} />
    );
};
