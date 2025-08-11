"use client";

import { useEffect, useRef } from "react";
import RubikCubeScene from "../components/RubikCubeScene";
import Button from "@/components/Button/Button";

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

    const rotateCubeSide = (cubeSide: string, clockwiseDirection: boolean) => {
        if (rubikCubeSceneRef.current) {
            // rubikCubeSceneRef.current.rotateObjectsAroundCenter(
            //     cubeSide,
            //     clockwiseDirection
            // );
        }
    };

    const rotateCubez = () => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.rotateObjectsAroundCenter("z");
        }
    };

    const rotateCubex = () => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.rotateObjectsAroundCenter("x");
        }
    };

    const rotateCubey = () => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.rotateObjectsAroundCenter("y");
        }
    };

    return (
        <div>
            <Button label={"z"} onClick={rotateCubez} />
            <Button label={"x"} onClick={rotateCubex} />
            <Button label={"y"} onClick={rotateCubey} />
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
