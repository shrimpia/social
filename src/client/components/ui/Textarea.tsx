import React from "react";

import styles from './Input.module.scss';

export type TextareaProp = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
};

export const Textarea: React.FC<TextareaProp> = (p) => {
    return (
        <textarea {...p} className={styles.input} />
    );
};
