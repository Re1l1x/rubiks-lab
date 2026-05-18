"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import RubikCubeScene from "./RubikCubeScene";

export type CubeFace = "U" | "D" | "F" | "B" | "L" | "R";
export type CubePalette = Record<CubeFace, string>;

export interface RubikCubeCanvasRef {
    solve: (algorithmName: "layerByLayer" | "fridrich") => void;
    scramble: () => void;
    setRotationSpeed: (speed: number) => void;
    setFaceColor: (face: CubeFace, hexColor: string) => void;
    applyPalette: (palette: CubePalette) => void;
}

const RubikCubeCanvas = forwardRef<RubikCubeCanvasRef>((_, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<RubikCubeScene | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const cubeScene = new RubikCubeScene(containerRef.current);
        sceneRef.current = cubeScene;
        containerRef.current.appendChild(cubeScene.renderer.domElement);

        const animate = () => {
            requestAnimationFrame(animate);
            cubeScene.render();
        };

        animate();

        const handleResize = () => {
            const { clientWidth, clientHeight } = containerRef.current!;
            cubeScene.camera.aspect = clientWidth / clientHeight;
            cubeScene.camera.updateProjectionMatrix();
            cubeScene.renderer.setSize(clientWidth, clientHeight);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            cubeScene.renderer.dispose();
            if (cubeScene.renderer.domElement && cubeScene.renderer.domElement.parentNode) {
                cubeScene.renderer.domElement.parentNode.removeChild(cubeScene.renderer.domElement);
            }
        };
    }, []);

    useImperativeHandle(ref, () => ({
        solve: (algorithmName: "layerByLayer" | "fridrich") => {
            if (sceneRef.current) {
                sceneRef.current.solveCube(algorithmName);
            }
        },
        scramble: () => {
            if (sceneRef.current) {
                sceneRef.current.scramble();
            }
        },
        setRotationSpeed: (speed: number) => {
            if (sceneRef.current) {
                sceneRef.current.setRotationSpeed(speed);
            }
        },
        setFaceColor: (face: CubeFace, hexColor: string) => {
            if (sceneRef.current) {
                sceneRef.current.setFaceColor(face, hexColor);
            }
        },
        applyPalette: (palette: CubePalette) => {
            if (sceneRef.current) {
                sceneRef.current.applyPalette(palette);
            }
        },
    }));

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                display: "flex",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        />
    );
});

RubikCubeCanvas.displayName = "RubikCubeCanvas";

export default RubikCubeCanvas;
