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

        this.screenMousePosition = new THREE.Vector2();
        this.startMousePosition = new THREE.Vector2();

        this.isDragging = false;

        this.isDirection = false;
        this.direction2;
        this.direction3;

        this.rotationAxis;

        this.moveVector = new THREE.Vector3(0, 0, 0);
        this.startPoint;
        this.endPoint;

        this.con = 0;

        this.lastMousePosition = new THREE.Vector2(0, 0);

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

        this.sceneControls = new SceneController(this.camera, this.renderer, this.renderer.domElement);

        this.renderer.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.clock = new THREE.Clock();
    }

    onMouseDown(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.screenMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.screenMousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.screenMousePosition, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cubies);

        if (intersects.length > 0) {
            this.startPoint = intersects[0].point;

            this.sceneControls.controls.enabled = false;

            this.isDragging = true;
        }
    }

    onMouseMove(event) {
        if (this.isDragging && this.centralCubeElement) {
            if (!this.isDirection) {
                this.isDirection = true;

                const rect = this.renderer.domElement.getBoundingClientRect();
                this.screenMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.screenMousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                this.raycaster.setFromCamera(this.screenMousePosition, this.camera);
                const intersects = this.raycaster.intersectObjects(this.cubies);

                if (intersects.length > 0) {
                    this.endPoint = intersects[0].point;

                    const deltaX = this.startPoint.x - this.endPoint.x;
                    const deltaY = this.startPoint.y - this.endPoint.y;
                    const deltaZ = this.startPoint.z - this.endPoint.z;
                    this.moveVector = new THREE.Vector3(-deltaX, -deltaY, -deltaZ).normalize();
                }

                const absX = Math.abs(this.moveVector.x);
                const absY = Math.abs(this.moveVector.y);
                const absZ = Math.abs(this.moveVector.z);

                if (absX >= absY && absX >= absZ) {
                    this.direction3 = "x";
                } else if (absY >= absX && absY >= absZ) {
                    this.direction3 = "y";
                } else {
                    this.direction3 = "z";
                }

                const cubeSideElements = this.findCubeSideElements();

                cubeSideElements.forEach((element) => {
                    this.centralCubeElement.attach(element);
                });

                // console.log(this.moveVector);
                let vector;
                let vector0 = new THREE.Vector3(0, 0, 0);

                if (this.direction3 == "x") {
                    vector = new THREE.Vector3(1, 0, 0);
                } else if (this.direction3 == "y") {
                    vector = new THREE.Vector3(0, 1, 0);
                } else if (this.direction3 == "z") {
                    vector = new THREE.Vector3(0, 0, 1);
                }
                vector.project(this.camera);
                vector0.project(this.camera);

                const widthHalf = window.innerWidth / 2;
                const heightHalf = window.innerHeight / 2;

                const screenX = vector.x * widthHalf + widthHalf;
                const screenY = -(vector.y * heightHalf) + heightHalf;

                const screenX2 = vector0.x * widthHalf + widthHalf;
                const screenY2 = -(vector0.y * heightHalf) + heightHalf;

                this.direction2 = new THREE.Vector2(screenX2 - screenX, screenY - screenY2).normalize();

                this.lastMousePosition = new THREE.Vector2(
                    this.screenMousePosition.x,
                    this.screenMousePosition.y
                );
            } else if (this.isDirection) {
                const rect = this.renderer.domElement.getBoundingClientRect();
                this.screenMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.screenMousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                const mousePosition = new THREE.Vector2(
                    this.screenMousePosition.x,
                    this.screenMousePosition.y
                );

                const movement = mousePosition.clone().sub(this.lastMousePosition);

                // Вычисляем скалярное произведение
                const dotProduct = movement.dot(this.direction2);

                // Обновляем последнюю позицию курсора
                this.lastMousePosition.copy(mousePosition);

                this.con += dotProduct;

                // Выводим результат
                // console.log("Скалярное произведение:", this.con);

                if (this.rotationAxis == "x") {
                    this.centralCubeElement.rotation.x += dotProduct * 5;
                }
                if (this.rotationAxis == "y") {
                    this.centralCubeElement.rotation.y += dotProduct * 5;
                }
                if (this.rotationAxis == "z") {
                    this.centralCubeElement.rotation.z += dotProduct * 5;
                }

                // if (this.direction == "x") {
                //     const rect = this.renderer.domElement.getBoundingClientRect();
                //     this.screenMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                //     this.screenMousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                //     this.raycaster.setFromCamera(this.screenMousePosition, this.camera);
                //     // Определение пересечения с плоскостью
                //     let intersection = new THREE.Vector3();
                //     this.raycaster.ray.intersectPlane(this.planeZ, intersection);
                //     if (intersection) {
                //         if (this.rotationAxis == "y") {
                //             this.centralCubeElement.rotation.y = intersection.x; // Поворот по оси Y
                //         } else if (this.rotationAxis == "z") {
                //             this.centralCubeElement.rotation.z = intersection.x;
                //         }
                //     }
                // } else if (this.direction == "y") {
                //     const rect = this.renderer.domElement.getBoundingClientRect();
                //     this.screenMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                //     this.screenMousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                //     this.raycaster.setFromCamera(this.screenMousePosition, this.camera);
                //     // Определение пересечения с плоскостью
                //     let intersection = new THREE.Vector3();
                //     this.raycaster.ray.intersectPlane(this.planeY, intersection);
                //     if (intersection) {
                //         if (this.rotationAxis == "x") {
                //             this.centralCubeElement.rotation.x = intersection.y; // Поворот по оси Y
                //         } else if (this.rotationAxis == "z") {
                //             this.centralCubeElement.rotation.z = intersection.y;
                //         }
                //     }
                // } else if (this.direction == "z") {
                //     const rect = this.renderer.domElement.getBoundingClientRect();
                //     this.screenMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                //     this.screenMousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                //     this.raycaster.setFromCamera(this.screenMousePosition, this.camera);
                //     // Определение пересечения с плоскостью
                //     let intersection = new THREE.Vector3();
                //     this.raycaster.ray.intersectPlane(this.planeZ, intersection);
                //     if (intersection) {
                //         if (this.rotationAxis == "x") {
                //             this.centralCubeElement.rotation.x = intersection.z; // Поворот по оси Y
                //         } else if (this.rotationAxis == "y") {
                //             this.centralCubeElement.rotation.y = intersection.z;
                //         }
                //     }
                // }
                // this.startMousePosition.x = event.clientX;
                // this.startMousePosition.y = event.clientY;
                // cubeSideElements.forEach((element) => {
                //     this.scene.attach(element);
                // });
            }

            // const rotationAxis = new THREE.Vector3();
            // rotationAxis.crossVectors(this.mainCubeElement, moveVector).normalize();

            // const rotationSpeed = 0.01;
            // // const angle = moveVector.length() * rotationSpeed;

            // this.mainCubeElement.rotateOnAxis(rotationAxis, angle);

            // this.startMousePosition.x = event.clientX;
            // this.startMousePosition.y = event.clientY;

            // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // this.raycaster.setFromCamera(this.mouse, this.camera);
            // const intersects = this.raycaster.intersectObjects(this.cubeElements);

            // if (intersects.length > 0) {
            //     const targetPosition = intersects[0].point;
            //     this.mainCubeElement.position.set(targetPosition);
            // }
        }
    }

    onMouseUp() {
        if (this.rotationAxis == "x") {
            console.log(this.centralCubeElement.rotation.x);
            console.log(this.findClosestNumber(this.centralCubeElement.rotation.x));
            this.centralCubeElement.rotation.x = this.findClosestNumber(this.centralCubeElement.rotation.x);
        }
        if (this.rotationAxis == "y") {
            this.centralCubeElement.rotation.y = this.findClosestNumber(this.centralCubeElement.rotation.y);
        }
        if (this.rotationAxis == "z") {
            this.centralCubeElement.rotation.z = this.findClosestNumber(this.centralCubeElement.rotation.z);
        }

        this.cubies.forEach((element) => {
            this.scene.attach(element);
        });

        this.centralCubeElement.rotation.set(0, 0, 0);

        this.isDragging = false;
        this.isDirection = false;

        this.sceneControls.controls.enabled = true;
    }

    findClosestNumber(input) {
        input = ((input % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        console.log(input);
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

    loadCube() {
        this.centralCubeElement;
        this.cubies = [];
        this.stickers = [];

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
                        this.centralCubeElement = object;
                    } else if (object.name.includes("Sticker")) {
                        this.stickers.push(object);
                    } else {
                        this.cubies.push(object);
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
                    this.cubies,
                    this.centralCubeElement,
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
            this.mixer.update(this.clock.getDelta() * 2);
        }
    }

    findCubeSideElements() {
        const selectedObjects = [];

        let intervalX = (x) => true;
        let intervalY = (y) => true;
        let intervalZ = (z) => true;

        if (this.direction3 == "x") {
            if (this.startPoint.y > 1.5 || this.startPoint.y < -1.5) {
                if (this.startPoint.z < -0.5) {
                    intervalZ = (z) => z < -0.5;
                } else if (this.startPoint.z > 0.5) {
                    intervalZ = (z) => 0.5 < z;
                } else {
                    intervalZ = (z) => -0.5 < z && z < 0.5;
                }
                this.rotationAxis = "z";
            } else if (this.startPoint.z > 1.5 || this.startPoint.z < -1.5) {
                if (this.startPoint.y < -0.5) {
                    intervalY = (y) => y < -0.5;
                } else if (this.startPoint.y > 0.5) {
                    intervalY = (y) => 0.5 < y;
                } else {
                    intervalY = (y) => -0.5 < y && y < 0.5;
                }
                this.rotationAxis = "y";
            }
        }

        if (this.direction3 == "y") {
            if (this.startPoint.x > 1.5 || this.startPoint.x < -1.5) {
                if (this.startPoint.z < -0.5) {
                    intervalZ = (z) => z < -0.5;
                } else if (this.startPoint.z > 0.5) {
                    intervalZ = (z) => 0.5 < z;
                } else {
                    intervalZ = (z) => -0.5 < z && z < 0.5;
                }
                this.rotationAxis = "z";
            } else if (this.startPoint.z > 1.5 || this.startPoint.z < -1.5) {
                if (this.startPoint.x < -0.5) {
                    intervalX = (x) => x < -0.5;
                } else if (this.startPoint.x > 0.5) {
                    intervalX = (x) => 0.5 < x;
                } else {
                    intervalX = (x) => -0.5 < x && x < 0.5;
                }
                this.rotationAxis = "x";
            }
        }

        if (this.direction3 == "z") {
            if (this.startPoint.x > 1.5 || this.startPoint.x < -1.5) {
                if (this.startPoint.y < -0.5) {
                    intervalY = (y) => y < -0.5;
                } else if (this.startPoint.y > 0.5) {
                    intervalY = (y) => 0.5 < y;
                } else {
                    intervalY = (y) => -0.5 < y && y < 0.5;
                }
                this.rotationAxis = "y";
            } else if (this.startPoint.y > 1.5 || this.startPoint.y < -1.5) {
                if (this.startPoint.x < -0.5) {
                    intervalX = (x) => x < -0.5;
                } else if (this.startPoint.x > 0.5) {
                    intervalX = (x) => 0.5 < x;
                } else {
                    intervalX = (x) => -0.5 < x && x < 0.5;
                }
                this.rotationAxis = "x";
            }
        }

        // if (this.direction == "y") {
        //     if (this.startPoint.y > 1.5 || this.startPoint.y < 1.5) {
        //         if (this.startPoint.z < -0.5) {
        //             intervalZ = (z) => z < -0.5;
        //         } else if (this.startPoint > 0.5) {
        //             intervalZ = (z) => 0.5 < z;
        //         } else {
        //             intervalZ = (z) => z < -0.5 && 0.5 < z;
        //         }
        //     }
        // }

        // if (this.direction == "z") {
        //     if (this.startPoint.y > 1.5 || this.startPoint.y < 1.5) {
        //         if (this.startPoint.z < -0.5) {
        //             intervalZ = (z) => z < -0.5;
        //         } else if (this.startPoint > 0.5) {
        //             intervalZ = (z) => 0.5 < z;
        //         } else {
        //             intervalZ = (z) => z < -0.5 && 0.5 < z;
        //         }
        //     }
        // }

        // if (point.x < -0.5) {
        //     intervalX = (x) => x < -0.5;
        // } else if (point.x > 0.5) {
        //     intervalX = (x) => 0.5 < x;
        // } else {
        //     intervalX = (x) => x < -0.5 && 0.5 < x;
        // }

        // if (point.y < -0.5) {
        //     intervalY = (y) => y < -0.5;
        // } else if (point.y > 0.5) {
        //     intervalY = (y) => 0.5 < y;
        // } else {
        //     intervalY = (y) => y < -0.5 && 0.5 < y;
        // }

        this.cubies.forEach((object) => {
            if (object.isMesh) {
                const position = object.position;
                if (intervalX(position.x) && intervalY(position.y) && intervalZ(position.z)) {
                    selectedObjects.push(object);
                }
            }
        });

        console.log(selectedObjects);

        return selectedObjects;
    }

    cubeInteraction(cubeSide, clockwiseDirection) {
        this.cubeControls.rotateSide(cubeSide, clockwiseDirection);
    }
}

export default RubikCubeScene;
