import React, { type PropsWithChildren } from "react";

import styles from './Form.module.scss';

export const Form: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <form className={styles.form}>
            {children}
        </form>
    );
};

export type FormItemProp = PropsWithChildren & {
    label: string;
};

export const FormItem: React.FC<FormItemProp> = ({label, children}) => {
    return (
        <label className={styles.formItem}>
            <div className={styles.formLabel}>
                {label}
            </div>
            {children}
        </label>
    );
};

export type SubmitButtonProp = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const SubmitButton: React.FC<SubmitButtonProp> = (p) => {
    return (
        <button type="button" {...p} className={styles.submitButton} />
    );
}