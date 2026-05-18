"use client";

import { useRef, useState } from "react";
import RubikCubeCanvas, {
    RubikCubeCanvasRef,
    CubeFace,
    CubePalette,
} from "@/components/RubikCube/RubikCubeCanvas";
import CubeRecolor from "@/components/CubeRecolor/CubeRecolor";
import styles from "./page.module.css";

type AlgorithmType = "layerByLayer" | "fridrich";

const Home = () => {
    const canvasRef = useRef<RubikCubeCanvasRef>(null);
    const [selectedMethod, setSelectedMethod] = useState<AlgorithmType>("layerByLayer");
    const [isSolving, setIsSolving] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [isRecolorOpen, setIsRecolorOpen] = useState(false);

    const handleScramble = () => {
        if (canvasRef.current && !isSolving) {
            canvasRef.current.scramble();
        }
    };

    const handleSolve = () => {
        if (canvasRef.current && !isSolving) {
            setIsSolving(true);
            canvasRef.current.solve(selectedMethod);
            setTimeout(() => {
                setIsSolving(false);
            }, 1000);
        }
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
        if (canvasRef.current) {
            const baseSpeed = Math.PI / 40;
            canvasRef.current.setRotationSpeed(baseSpeed * newSpeed);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.controlPanel}>
                <div className={styles.section}>
                    <div className={styles.label}>Метод</div>
                    <div className={styles.methodSelector}>
                        <div className={styles.radioOption}>
                            <input
                                type="radio"
                                id="layerByLayer"
                                name="method"
                                value="layerByLayer"
                                checked={selectedMethod === "layerByLayer"}
                                onChange={() => setSelectedMethod("layerByLayer")}
                                className={styles.radioInput}
                            />
                            <label htmlFor="layerByLayer" className={styles.radioLabel}>
                                Послойный метод
                            </label>
                        </div>
                        <div className={styles.radioOption}>
                            <input
                                type="radio"
                                id="fridrich"
                                name="method"
                                value="fridrich"
                                checked={selectedMethod === "fridrich"}
                                onChange={() => setSelectedMethod("fridrich")}
                                className={styles.radioInput}
                            />
                            <label htmlFor="fridrich" className={styles.radioLabel}>
                                Метод Фридрих (CFOP)
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.label}>Скорость</div>
                    <div className={styles.speedControl}>
                        <input
                            type="range"
                            min="0.25"
                            max="3"
                            step="0.25"
                            value={speed}
                            onChange={handleSpeedChange}
                            className={styles.speedSlider}
                        />
                        <span className={styles.speedValue}>{speed.toFixed(2)}x</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.label}>Управление</div>
                    <div className={styles.buttons}>
                        <button
                            className={styles.button}
                            onClick={handleScramble}
                            disabled={isSolving}
                        >
                            Перемешать
                        </button>
                        <button
                            className={styles.button}
                            onClick={handleSolve}
                            disabled={isSolving}
                        >
                            Собрать
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.label}>Внешний вид</div>
                    <div className={styles.buttons}>
                        <button
                            className={styles.button}
                            onClick={() => setIsRecolorOpen(true)}
                            disabled={isSolving}
                        >
                            Перекрасить кубик
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.label}>Информация</div>
                    <div className={styles.buttons}>
                        <a
                            className={styles.button}
                            href="/about/developers"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            О разработчиках
                        </a>
                        <a
                            className={styles.button}
                            href="/about/system"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            О системе
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.container}>
                <RubikCubeCanvas ref={canvasRef} />
            </div>

            {isRecolorOpen && (
                <CubeRecolor
                    onClose={() => setIsRecolorOpen(false)}
                    onApplyFace={(face: CubeFace, hex: string) =>
                        canvasRef.current?.setFaceColor(face, hex)
                    }
                    onApplyPalette={(palette: CubePalette) =>
                        canvasRef.current?.applyPalette(palette)
                    }
                />
            )}
        </div>
    );
};

export default Home;
