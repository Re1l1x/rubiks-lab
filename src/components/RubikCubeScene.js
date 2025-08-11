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

        this.camera.position.set(7, 5, 7);
        this.camera.lookAt(0, 0, 0);

        this.loadCube();
        this.addLights();

        this.sceneControls = new SceneController(
            this.camera,
            this.renderer,
            this.renderer.domElement
        );

        this.cubeControls = new RubikCubeController();

        this.this.clock = new THREE.Clock();
    }

    loadCube() {
        this.cubeElements = [];
        this.mainElement;
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
                    console.log(object);
                    this.cubeElements.push(object);
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

    rotateObjectsAroundCenter(napr) {
        const objects = this.findObjectsInRange(napr);
        const mainCube = this.findMainCube()[0];
        const angle = Math.PI / 2;
        // console.log(objects);
        // console.log(mainCube);

        objects.forEach((element) => {
            mainCube.attach(element);
        });

        if (napr == "z") {
            this.animations[2].play();
            setTimeout(() => {
                console.log("Анимация завершена!");
                objects.forEach((element) => {
                    this.scene.attach(element);
                });
                this.animations[2].stop();
            }, this.animationDuration * 1000);
        }
        if (napr == "x") {
            this.animations[0].play();
            setTimeout(() => {
                console.log("Анимация завершена!");
                objects.forEach((element) => {
                    this.scene.attach(element);
                });
                this.animations[0].stop();
            }, this.animationDuration * 1000);
            // mainCube.rotateX(Math.PI / 2);
            // objects.forEach((element) => {
            //     this.scene.attach(element);
            // });
        }
        if (napr == "y") {
            this.animations[1].play();
            setTimeout(() => {
                console.log("Анимация завершена!");
                objects.forEach((element) => {
                    this.scene.attach(element);
                });
                this.animations[1].stop();
            }, this.animationDuration * 1000);
            // mainCube.rotateY(Math.PI / 2);
            // objects.forEach((element) => {
            //     this.scene.attach(element);
            // });
        }

        // if (napr == "z") {
        //     mainCube.rotateZ(-Math.PI / 2);
        // }
        // if (napr == "x") {
        //     mainCube.rotateX(-Math.PI / 2);
        // }
        // if (napr == "y") {
        //     mainCube.rotateY(-Math.PI / 2);
        // }

        // if (objects.length === 0) return;

        // // Шаг 1: Вычисление общего центра
        // const center = new THREE.Vector3();
        // objects.forEach((object) => {
        //     center.add(object.position);
        // });
        // center.divideScalar(objects.length);

        // objects.forEach((object) => {
        //     object.position.sub(center);
        // });

        // const quaternion = new THREE.Quaternion();
        // quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        // objects.forEach((object) => {
        //     object.quaternion.multiplyQuaternions(
        //         quaternion,
        //         object.quaternion
        //     );
        // });

        // objects.forEach((object) => {
        //     object.position.add(center);
        // });
    }

    findMainCube() {
        const selectedObjects = [];
        this.cubeElements.forEach((object) => {
            if (object.isMesh) {
                const position = object.position;
                if (position.x == 0 && position.y == 0 && position.z == 0) {
                    selectedObjects.push(object);
                }
            }
        });

        return selectedObjects;
    }

    findObjectsInRange(napr) {
        const selectedObjects = [];

        this.cubeElements.forEach((object) => {
            if (object.isMesh) {
                const position = object.position;
                if (napr == "z" && position.z >= 0.5) {
                    selectedObjects.push(object);
                }
                if (napr == "x" && position.x >= 0.5) {
                    selectedObjects.push(object);
                }
                if (napr == "y" && position.y >= 0.5) {
                    selectedObjects.push(object);
                }
            }
        });

        return selectedObjects;
    }
}

export default RubikCubeScene;
