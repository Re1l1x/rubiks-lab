"use client";

import { useState } from "react";
import Container from "@/components/Container/Container";
import RubikCubeCanvas from "@/components/RubikCube/RubikCubeCanvas";
import styles from "./page.module.css";

const Introdaction = () => {
    const [activePage, setActivePage] = useState(0);

    return (
        <div className={styles.page}>
            <Container label="Description">
                {activePage === 0 && <div className={styles.content}>Content 0</div>}
                {activePage === 1 && <div className={styles.content}>Content 1</div>}
                {activePage === 2 && <div className={styles.content}>Content 2</div>}
                {activePage === 3 && <div className={styles.content}>Content 3</div>}
                {activePage === 4 && <div className={styles.content}>Content 4</div>}
                {activePage === 5 && <div className={styles.content}>Content 5</div>}
                {activePage === 6 && <div className={styles.content}>Content 6</div>}
                {activePage === 7 && <div className={styles.content}>Content 7</div>}
                {activePage === 8 && <div className={styles.content}>Content 8</div>}
                <div className={styles.navigationBar}>
                    <div className={styles.navigationButton} onClick={() => setActivePage(0)}>
                        Introduction
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(1)}>
                        1
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(2)}>
                        2
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(3)}>
                        3
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(4)}>
                        4
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(5)}>
                        5
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(6)}>
                        6
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(7)}>
                        7
                    </div>
                    <div className={styles.navigationButton} onClick={() => setActivePage(8)}>
                        Conclusion
                    </div>
                </div>
            </Container>
            <Container className={styles.container} label="Rubik's cube">
                <RubikCubeCanvas />
            </Container>
        </div>
    );
};

export default Introdaction;
