"use client";

import { useEffect, useRef } from "react";
import RubikCubeScene from "./RubikCubeScene";

export default function RubikCubeCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const cubeScene = new RubikCubeScene(containerRef.current);
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
}
