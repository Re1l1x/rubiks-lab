import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SceneController from "./SceneController";
import RubikCubeController from "./RubikCubeController";

class RubikCubeScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.raycaster = new THREE.Raycaster();

        this.sensitivity = 7;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.background = new THREE.Color(0x7e7e7e);

        this.camera.position.set(5, 3, 5);
        this.camera.lookAt(0, 0, 0);

        this.loadCube();
        this.addClickbox();
        this.addLights();

        this.sceneControls = new SceneController(this.camera, this.renderer, this.renderer.domElement);

        this.renderer.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

        this.isShiftPressed = false;

        this.rect = this.renderer.domElement.getBoundingClientRect();

        this.screenMousePosition = new THREE.Vector2();

        // prettier-ignore
        this.vectors = {
            "-x": new THREE.Vector3(-1, 0, 0),
            "x": new THREE.Vector3(1, 0, 0),
            "-y": new THREE.Vector3(0, -1, 0),
            "y": new THREE.Vector3(0, 1, 0),
            "-z": new THREE.Vector3(0, 0, -1),
            "z": new THREE.Vector3(0, 0, 1),
        };

        this.isGrabbing = false;
        this.isDragging = false;

        this.startPoint2D;
        this.startPoint3D;
        this.endPoint2D;
        this.endPoint3D;

        this.moveVector2D;
        this.moveVector3D;

        this.rotationAxis;

        this.cubeSideElements = [];
    }

    loadCube() {
        this.centralCubeElement;
        this.cubies = [];
        this.stickers = [];

        const loader = new GLTFLoader();
        loader.load(
            "/models/RubikCube.glb",
            (gltf) => {
                this.cube = gltf.scene;
                this.scene.add(this.cube);

                gltf.scene.traverse((object) => {
                    if (object.name == "Center") {
                        this.centralCubeElement = object;
                    } else if (object.name.includes("Sticker")) {
                        this.stickers.push(object);
                    } else {
                        this.cubies.push(object);
                    }
                });

                this.cubeControls = new RubikCubeController(this.scene, this.cubies, this.centralCubeElement);
            },
            undefined,
            (error) => {
                console.error("Ошибка загрузки модели:", error);
            }
        );
    }

    addClickbox() {
        const geometry = new THREE.BoxGeometry(3.02, 3.02, 3.02);
        const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        this.clickbox = new THREE.Mesh(geometry, material);
        this.clickbox.position.set(0, 0, 0);
        this.scene.add(this.clickbox);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
    }

    onMouseDown(event) {
        const intersects = this.getMouseIntersections(event);

        if (intersects.length > 0) {
            this.startPoint3D = intersects[0].point;
            this.startPoint2D = new THREE.Vector2().copy(this.screenMousePosition);

            this.sceneControls.controls.enabled = false;
            this.isGrabbing = true;
        }
    }

    onMouseMove(event) {
        if (this.isGrabbing && this.centralCubeElement) {
            if (!this.isDragging) {
                this.updateScreenMousePosition(event);
                const distance = this.screenMousePosition.distanceTo(this.startPoint2D);

                if (distance > 0.01) {
                    const intersects = this.getMouseIntersections(event);

                    if (intersects.length > 0) {
                        this.endPoint3D = intersects[0].point.clone();
                        this.moveVector3D =
                            this.vectors[this.getDominantDirection(this.endPoint3D.sub(this.startPoint3D))];

                        this.endPoint2D = new THREE.Vector2().copy(this.screenMousePosition);
                        const projection = this.moveVector3D.clone().project(this.camera);
                        this.moveVector2D = new THREE.Vector2(projection.x, projection.y).normalize();

                        this.rotationAxis =
                            this.vectors[this.getDominantDirection(this.startPoint3D)].clone();
                        this.rotationAxis.cross(this.moveVector3D);

                        this.cubeSideElements = this.findCubeSideElements();
                        this.cubeSideElements.forEach((element) => {
                            this.centralCubeElement.attach(element);
                        });

                        this.isDragging = true;
                    }
                }
            } else if (this.isDragging) {
                this.updateScreenMousePosition(event);

                const dotProduct = this.screenMousePosition
                    .clone()
                    .sub(this.endPoint2D)
                    .dot(this.moveVector2D);

                this.endPoint2D.copy(this.screenMousePosition);

                const axis = Object.keys(this.vectors).find((axis) =>
                    this.rotationAxis.equals(this.vectors[axis])
                );

                this.centralCubeElement.rotation[axis.replace("-", "")] +=
                    dotProduct * 7 * (axis.includes("-") ? -1 : 1);
            }
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            if (this.rotationAxis.equals(this.vectors["x"]) || this.rotationAxis.equals(this.vectors["-x"])) {
                this.centralCubeElement.rotation.x = this.findClosestNumber(
                    this.centralCubeElement.rotation.x
                );
            }
            if (this.rotationAxis.equals(this.vectors["y"]) || this.rotationAxis.equals(this.vectors["-y"])) {
                this.centralCubeElement.rotation.y = this.findClosestNumber(
                    this.centralCubeElement.rotation.y
                );
            }
            if (this.rotationAxis.equals(this.vectors["z"]) || this.rotationAxis.equals(this.vectors["-z"])) {
                this.centralCubeElement.rotation.z = this.findClosestNumber(
                    this.centralCubeElement.rotation.z
                );
            }

            this.cubeSideElements.forEach((element) => {
                this.scene.attach(element);
            });

            this.centralCubeElement.rotation.set(0, 0, 0);
        }

        this.isGrabbing = false;
        this.isDragging = false;

        this.sceneControls.controls.enabled = true;
    }

    handleKeyDown = (event) => {
        if (event.key === "Shift") {
            this.isShiftPressed = true;
        }
    };

    handleKeyUp = (event) => {
        if (event.key === "Shift") {
            this.isShiftPressed = false;
        }
    };

    render() {
        this.sceneControls.update();
        this.renderer.render(this.scene, this.camera);
        if (this.cubeControls) {
            this.cubeControls.animate();
        }
    }

    updateScreenMousePosition(event) {
        this.screenMousePosition.x = ((event.clientX - this.rect.left) / this.rect.width) * 2 - 1;
        this.screenMousePosition.y = -((event.clientY - this.rect.top) / this.rect.height) * 2 + 1;
    }

    getMouseIntersections(event) {
        this.updateScreenMousePosition(event);

        this.raycaster.setFromCamera(this.screenMousePosition, this.camera);
        return this.raycaster.intersectObjects([this.clickbox]);
    }

    getDominantDirection(vector) {
        const directions = [
            { direction: "x", value: Math.abs(vector.x), originalValue: vector.x },
            { direction: "y", value: Math.abs(vector.y), originalValue: vector.y },
            { direction: "z", value: Math.abs(vector.z), originalValue: vector.z },
        ];

        const dominant = directions.reduce((prev, current) => {
            return prev.value > current.value ? prev : current;
        });

        return (dominant.originalValue < 0 ? "-" : "") + dominant.direction;
    }

    findClosestNumber(input) {
        input = ((input % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const numbers = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];

        let closestNumber = numbers[0];
        let minDistance = Math.abs(input - closestNumber);

        for (let i = 1; i < numbers.length; i++) {
            const distance = Math.abs(input - numbers[i]);

            if (distance < minDistance) {
                minDistance = distance;
                closestNumber = numbers[i];
            }
        }

        return closestNumber;
    }

    findCubeSideElements() {
        const selectedObjects = [];

        let intervalX = (x) => true;
        let intervalY = (y) => true;
        let intervalZ = (z) => true;

        if (this.rotationAxis.x != 0) {
            if (this.startPoint3D.x < -0.5) {
                intervalX = (x) => x < -0.5;
            } else if (this.startPoint3D.x > 0.5) {
                intervalX = (x) => x > 0.5;
            } else {
                intervalX = (x) => -0.5 < x && x < 0.5;
            }
        }
        if (this.rotationAxis.y != 0) {
            if (this.startPoint3D.y < -0.5) {
                intervalY = (y) => y < -0.5;
            } else if (this.startPoint3D.y > 0.5) {
                intervalY = (y) => y > 0.5;
            } else {
                intervalY = (y) => -0.5 < y && y < 0.5;
            }
        }
        if (this.rotationAxis.z != 0) {
            if (this.startPoint3D.z < -0.5) {
                intervalZ = (z) => z < -0.5;
            } else if (this.startPoint3D.z > 0.5) {
                intervalZ = (z) => z > 0.5;
            } else {
                intervalZ = (z) => -0.5 < z && z < 0.5;
            }
        }

        this.cubies.forEach((object) => {
            if (object.isMesh) {
                const position = object.position;
                if (
                    this.isShiftPressed ||
                    (intervalX(position.x) && intervalY(position.y) && intervalZ(position.z))
                ) {
                    selectedObjects.push(object);
                }
            }
        });

        return selectedObjects;
    }

    cubeInteraction(cubeSide, clockwiseDirection) {
        this.cubeControls.rotateSide(cubeSide, clockwiseDirection);
    }

    scramble() {
        this.cubeControls.scramble();
    }
}

export default RubikCubeScene;
