import React from 'react';
import styles from './CheckBox.module.scss';

export type CheckBoxProps = {
    label?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = (props) => {
    return (
        <label className={styles.label}>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={props.checked}
                defaultChecked={props.defaultChecked}
                disabled={props.disabled}
                onChange={(e) => props.onChange?.(e.target.checked)}
            />
            <div className={styles.checkboxView}>
                <i className="ti ti-check" />
            </div>
            {props.label}
        </label>
    );
};