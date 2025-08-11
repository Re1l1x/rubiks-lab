"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const GltfModel = () => {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(7, 5, 7);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const loader = new GLTFLoader();
        loader.load(
            "/models/Cube2.glb",
            (gltf) => {
                scene.add(gltf.scene);
                animate();
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );

        scene.background = new THREE.Color(0x7e7e7e);

        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.screenSpacePanning = true;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return null;
};

export default GltfModel;
