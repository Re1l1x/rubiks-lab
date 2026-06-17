"use client";

import { useState } from "react";
import type { CubeFace, CubePalette } from "@/components/RubikCube/RubikCubeCanvas";
import styles from "./CubeRecolor.module.css";

interface Props {
    onClose: () => void;
    onApplyFace: (face: CubeFace, hexColor: string) => void;
    onApplyPalette: (palette: CubePalette) => void;
}

const STANDARD_PALETTE: CubePalette = {
    U: "#ffffff",
    D: "#ffd500",
    F: "#009b48",
    B: "#0046ad",
    L: "#ff5800",
    R: "#b71234",
};

const PRESET_PALETTES: { name: string; palette: CubePalette }[] = [
    {
        name: "Стандартный",
        palette: STANDARD_PALETTE,
    },
    {
        name: "Монохром",
        palette: { U: "#f5f5f5", D: "#1a1a1a", F: "#6e6e6e", B: "#3a3a3a", L: "#9e9e9e", R: "#505050" },
    },
    {
        name: "Пастель",
        palette: { U: "#fffacd", D: "#ffdab9", F: "#c1e1c1", B: "#a7c7e7", L: "#ffb6c1", R: "#e6e6fa" },
    },
    {
        name: "Неон",
        palette: { U: "#39ff14", D: "#ff073a", F: "#04d9ff", B: "#ff6ec7", L: "#fffb00", R: "#bc13fe" },
    },
    {
        name: "Земляной",
        palette: { U: "#f5deb3", D: "#8b4513", F: "#556b2f", B: "#2f4f4f", L: "#cd853f", R: "#a0522d" },
    },
];

const FACE_LABELS: Record<CubeFace, string> = {
    U: "Верх",
    D: "Низ",
    F: "Перед",
    B: "Зад",
    L: "Лево",
    R: "Право",
};

const CubeRecolor = ({ onClose, onApplyFace, onApplyPalette }: Props) => {
    const [faceColors, setFaceColors] = useState<CubePalette>(STANDARD_PALETTE);
    const [selectedFace, setSelectedFace] = useState<CubeFace>("F");
    const [selectedPalette, setSelectedPalette] = useState<number | null>(0);

    const currentColor = faceColors[selectedFace];

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setFaceColors({ ...faceColors, [selectedFace]: newColor });
        setSelectedPalette(null);
    };

    const handlePresetSelect = (index: number) => {
        setSelectedPalette(index);
        setFaceColors(PRESET_PALETTES[index].palette);
    };

    const handleApply = () => {
        if (selectedPalette !== null) {
            onApplyPalette(PRESET_PALETTES[selectedPalette].palette);
        } else {
            (Object.keys(faceColors) as CubeFace[]).forEach((f) => {
                onApplyFace(f, faceColors[f]);
            });
        }
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose} aria-label="Закрыть">
                    ×
                </button>

                <div className={styles.topRow}>
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Выберите грань</div>
                        <div className={styles.faceNet}>
                            <div className={styles.faceRow}>
                                <div className={styles.faceSlot} />
                                <FaceTile
                                    face="U"
                                    color={faceColors.U}
                                    selected={selectedFace === "U"}
                                    onSelect={setSelectedFace}
                                />
                                <div className={styles.faceSlot} />
                                <div className={styles.faceSlot} />
                            </div>
                            <div className={styles.faceRow}>
                                <FaceTile
                                    face="L"
                                    color={faceColors.L}
                                    selected={selectedFace === "L"}
                                    onSelect={setSelectedFace}
                                />
                                <FaceTile
                                    face="F"
                                    color={faceColors.F}
                                    selected={selectedFace === "F"}
                                    onSelect={setSelectedFace}
                                />
                                <FaceTile
                                    face="R"
                                    color={faceColors.R}
                                    selected={selectedFace === "R"}
                                    onSelect={setSelectedFace}
                                />
                                <FaceTile
                                    face="B"
                                    color={faceColors.B}
                                    selected={selectedFace === "B"}
                                    onSelect={setSelectedFace}
                                />
                            </div>
                            <div className={styles.faceRow}>
                                <div className={styles.faceSlot} />
                                <FaceTile
                                    face="D"
                                    color={faceColors.D}
                                    selected={selectedFace === "D"}
                                    onSelect={setSelectedFace}
                                />
                                <div className={styles.faceSlot} />
                                <div className={styles.faceSlot} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Выбор предустановленной палитры</div>
                        <div className={styles.presets}>
                            {PRESET_PALETTES.map((preset, idx) => (
                                <label key={preset.name} className={styles.presetRow}>
                                    <input
                                        type="radio"
                                        name="palette"
                                        checked={selectedPalette === idx}
                                        onChange={() => handlePresetSelect(idx)}
                                    />
                                    <div className={styles.presetSwatches}>
                                        {(Object.keys(preset.palette) as CubeFace[]).map((f) => (
                                            <div
                                                key={f}
                                                className={styles.presetSwatch}
                                                style={{ backgroundColor: preset.palette[f] }}
                                            />
                                        ))}
                                    </div>
                                    <span className={styles.presetName}>{preset.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionTitle}>
                        Выберите цвет — {FACE_LABELS[selectedFace]}
                    </div>
                    <div className={styles.colorPicker}>
                        <div
                            className={styles.colorPreview}
                            style={{ backgroundColor: currentColor }}
                        />
                        <input
                            type="color"
                            value={currentColor}
                            onChange={handleColorChange}
                            className={styles.colorInput}
                        />
                        <span className={styles.colorHex}>{currentColor.toUpperCase()}</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.applyButton} onClick={handleApply}>
                        Применить
                    </button>
                </div>
            </div>
        </div>
    );
};

const FaceTile = ({
    face,
    color,
    selected,
    onSelect,
}: {
    face: CubeFace;
    color: string;
    selected: boolean;
    onSelect: (face: CubeFace) => void;
}) => (
    <button
        type="button"
        className={`${styles.faceTile} ${selected ? styles.faceTileSelected : ""}`}
        style={{ backgroundColor: color }}
        onClick={() => onSelect(face)}
        aria-label={FACE_LABELS[face]}
        title={FACE_LABELS[face]}
    />
);

export default CubeRecolor;
