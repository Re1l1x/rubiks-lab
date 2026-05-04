"use client";

import React, { ReactNode } from "react";
import styles from "./Container.module.css";

interface Props {
    className?: string;
    label?: string;
    children: ReactNode;
}

const Container = (props: Props) => {
    return (
        <div className={`${styles.container} ${props.className}`}>
            <div className={styles.top}>{props.label}</div>
            <div className={styles.content}>{props.children}</div>
        </div>
    );
};

export default Container;
