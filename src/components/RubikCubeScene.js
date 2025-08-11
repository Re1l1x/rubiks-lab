import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneController from "./SceneController";
import RubikCubeController from "./RubikCubeController";

class RubikCubeScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0x7e7e7e);

        this.camera.position.set(5, 3, 5);
        this.camera.lookAt(0, 0, 0);

        this.loadCube();
        this.addLights();

        this.sceneControls = new SceneController(
            this.camera,
            this.renderer,
            this.renderer.domElement
        );

        this.clock = new THREE.Clock();
    }

    loadCube() {
        this.cubeElements = [];
        this.mainCubeElement;

        this.mixer;
        this.animations = [];
        this.animationDuration;

        const loader = new GLTFLoader();
        loader.load(
            "/models/RubikCube.glb",
            (gltf) => {
                this.cube = gltf.scene;
                this.scene.add(this.cube);

                gltf.scene.traverse((object) => {
                    if (object.name == "Center") {
                        this.mainCubeElement = object;
                    } else {
                        this.cubeElements.push(object);
                    }
                });

                this.mixer = new THREE.AnimationMixer(this.cube);

                if (gltf.animations && gltf.animations.length) {
                    this.animations = gltf.animations.map((clip) => {
                        this.animationDuration = clip.duration;
                        const action = this.mixer.clipAction(clip);
                        action.clampWhenFinished = true;
                        action.setLoop(THREE.LoopOnce);
                        return action;
                    });
                } else {
                    console.log("Нет анимаций в загруженной модели.");
                }

                this.cubeControls = new RubikCubeController(
                    this.scene,
                    this.cubeElements,
                    this.mainCubeElement,
                    this.animations,
                    this.animationDuration
                );
            },
            undefined,
            (error) => {
                console.error("Ошибка загрузки модели:", error);
            }
        );
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    }

    render() {
        this.sceneControls.update();
        this.renderer.render(this.scene, this.camera);
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
    }

    cubeInteraction(cubeSide, clockwiseDirection) {
        this.cubeControls.rotateSide(cubeSide, clockwiseDirection);
    }
}

export default RubikCubeScene;
