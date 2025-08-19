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
            rubikCubeSceneRef.current.cubeInteraction(cubeSide, clockwiseDirection);
        }
    };

    const scramble = () => {
        if (rubikCubeSceneRef.current) {
            rubikCubeSceneRef.current.scramble();
        }
    };

    return (
        <div>
            <div>clockwise</div>
            <Button label={"x"} onClick={() => rotateCubeSide("x", true)} />
            <Button label={"-x"} onClick={() => rotateCubeSide("-x", true)} />
            <Button label={"y"} onClick={() => rotateCubeSide("y", true)} />
            <Button label={"-y"} onClick={() => rotateCubeSide("-y", true)} />
            <Button label={"z"} onClick={() => rotateCubeSide("z", true)} />
            <Button label={"-z"} onClick={() => rotateCubeSide("-z", true)} />
            <div>counterclockwise</div>
            <Button label={"x"} onClick={() => rotateCubeSide("x", false)} />
            <Button label={"-x"} onClick={() => rotateCubeSide("-x", false)} />
            <Button label={"y"} onClick={() => rotateCubeSide("y", false)} />
            <Button label={"-y"} onClick={() => rotateCubeSide("-y", false)} />
            <Button label={"z"} onClick={() => rotateCubeSide("z", false)} />
            <Button label={"-z"} onClick={() => rotateCubeSide("-z", false)} />
            <div>scramble</div>
            <Button label={"scramble"} onClick={() => scramble()} />
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
