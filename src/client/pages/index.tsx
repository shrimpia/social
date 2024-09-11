import React, { useEffect, useState } from "react";

import styles from './index.module.scss';
import { Note } from "../components/domains/note/Note";
import { api } from "../api";

export default (() => {

    return (
        <div className={styles.timeline}>
            <Note />
        </div>
    );
}) as React.FC;
