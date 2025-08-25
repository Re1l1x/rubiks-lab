"use client";

import { useEffect, useRef } from "react";
import RubikCubeScene from "../components/RubikCubeScene";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";

const RubikCube = () => {
    const rubikCubeSceneRef = useRef<RubikCubeScene | null>(null);

    useEffect(() => {
        const rubikCubeScene = new RubikCubeScene();
        rubikCubeSceneRef.current = rubikCubeScene;

        const animate = () => {
            requestAnimationFrame(animate);
            rubikCubeScene.render();
        };

        animate();
    }, []);

    const changeMode = (mode: string) => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.changeMode(mode);
        }
    };

    const rotateCubeSide = (cubeSide: string, clockwiseDirection: boolean) => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.cubeInteraction(cubeSide, clockwiseDirection);
        }
    };

    const scramble = () => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.scramble();
        }
    };

    const setBrushColor = (color: string) => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.setBrushColor(color);
        }
    };

    return (
        <div className={styles.column}>
            <div>mode</div>
            <div className={styles.row}>
                <Button label={"rotate"} onClick={() => changeMode("rotating")} />
                <Button label={"paint"} onClick={() => changeMode("painting")} />
            </div>
            <div className={styles.row}>
                <div className={styles.column}>
                    <div>clockwise</div>
                    <div className={styles.row}>
                        <Button label={"x"} onClick={() => rotateCubeSide("x", true)} />
                        <Button label={"-x"} onClick={() => rotateCubeSide("-x", true)} />
                        <Button label={"y"} onClick={() => rotateCubeSide("y", true)} />
                        <Button label={"-y"} onClick={() => rotateCubeSide("-y", true)} />
                        <Button label={"z"} onClick={() => rotateCubeSide("z", true)} />
                        <Button label={"-z"} onClick={() => rotateCubeSide("-z", true)} />
                    </div>
                    <div>counterclockwise</div>
                    <div className={styles.row}>
                        <Button label={"x"} onClick={() => rotateCubeSide("x", false)} />
                        <Button label={"-x"} onClick={() => rotateCubeSide("-x", false)} />
                        <Button label={"y"} onClick={() => rotateCubeSide("y", false)} />
                        <Button label={"-y"} onClick={() => rotateCubeSide("-y", false)} />
                        <Button label={"z"} onClick={() => rotateCubeSide("z", false)} />
                        <Button label={"-z"} onClick={() => rotateCubeSide("-z", false)} />
                    </div>
                    <div>scramble</div>
                    <Button label={"scramble"} onClick={() => scramble()} />
                </div>
                <div className={styles.column}>
                    <div>Color</div>
                    <div className={styles.row}>
                        <Button label={""} className={styles.buttonN} onClick={() => setBrushColor("gray")} />
                        <Button
                            label={""}
                            className={styles.buttonW}
                            onClick={() => setBrushColor("white")}
                        />
                        <Button
                            label={""}
                            className={styles.buttonY}
                            onClick={() => setBrushColor("yellow")}
                        />
                        <Button label={""} className={styles.buttonR} onClick={() => setBrushColor("red")} />
                        <Button
                            label={""}
                            className={styles.buttonO}
                            onClick={() => setBrushColor("orange")}
                        />
                        <Button label={""} className={styles.buttonB} onClick={() => setBrushColor("blue")} />
                        <Button
                            label={""}
                            className={styles.buttonG}
                            onClick={() => setBrushColor("green")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    return (
        <div>
            <RubikCube />
        </div>
    );
}
