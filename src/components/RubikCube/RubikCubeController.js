class RubikCubeController {
    constructor(scene, centralCubeElement, cubies, stickers) {
        this.scene = scene;
        this.centralCubeElement = centralCubeElement;
        this.cubies = cubies;
        this.stickers = stickers;

        this.isAnimating = false;

        this.currentRotation = 0;
        this.targetRotation = 0;
        this.rotationSpeed = Math.PI / 40;
    }

    scramble() {
        return new Promise(async (resolve) => {
            const rotationAxes = ["x", "y", "z"];
            const cubeLayers = ["-1", "1"];
            const clockwiseDirections = [true, false];

            let lastRotationAxisNum = -1;
            let lastCubeLayerNum = -1;
            let lastClockwiseDirectionNum = -1;

            for (let i = 0; i < 10; i++) {
                let rotationAxisNum, cubeLayerNum, clockwiseDirectionNum;

                do {
                    rotationAxisNum = this.getRandomInt(0, 2);
                    cubeLayerNum = this.getRandomInt(0, 1);
                    clockwiseDirectionNum = this.getRandomInt(0, 1);
                } while (
                    rotationAxisNum === lastRotationAxisNum &&
                    cubeLayerNum === lastCubeLayerNum &&
                    clockwiseDirectionNum !== lastClockwiseDirectionNum
                );

                await this.rotateSide(
                    rotationAxes[rotationAxisNum],
                    cubeLayers[cubeLayerNum],
                    clockwiseDirections[clockwiseDirectionNum]
                );

                lastRotationAxisNum = rotationAxisNum;
                lastCubeLayerNum = cubeLayerNum;
                lastClockwiseDirectionNum = clockwiseDirectionNum;
            }

            resolve();
        });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = speed;
    }

    player(sequence) {
        console.log(sequence);
        console.log(sequence.length);
        return new Promise(async (resolve) => {
            let rotationAxis, cubeLayer, clockwiseDirection;

            for (let i = 0; i < sequence.length; i++) {
                if (sequence[i].includes("U")) {
                    rotationAxis = "y";
                    cubeLayer = 1;
                } else if (sequence[i].includes("D")) {
                    rotationAxis = "y";
                    cubeLayer = -1;
                } else if (sequence[i].includes("F")) {
                    rotationAxis = "x";
                    cubeLayer = 1;
                } else if (sequence[i].includes("B")) {
                    rotationAxis = "x";
                    cubeLayer = -1;
                } else if (sequence[i].includes("R")) {
                    rotationAxis = "z";
                    cubeLayer = -1;
                } else if (sequence[i].includes("L")) {
                    rotationAxis = "z";
                    cubeLayer = 1;
                }

                clockwiseDirection = !sequence[i].includes("'");

                await this.rotateSide(rotationAxis, cubeLayer, clockwiseDirection);
            }

            resolve();
        });
    }

    rotateSide(rotationAxis, cubeLayer, clockwiseDirection) {
        return new Promise((resolve) => {
            if (!this.isAnimating) {
                this.isAnimating = true;

                const cubeSideElements = this.findCubeSideElements(rotationAxis, cubeLayer);
                cubeSideElements.forEach((element) => {
                    this.centralCubeElement.attach(element);
                });

                this.targetRotation =
                    (cubeLayer == -1 ? 1 : -1) * (clockwiseDirection ? 1 : -1) * (Math.PI / 2);

                const animateLoop = () => {
                    const increment =
                        (cubeLayer == -1 ? 1 : -1) * (clockwiseDirection ? 1 : -1) * this.rotationSpeed;
                    const nextRotation = this.currentRotation + increment;

                    // Clamp to target to prevent overshoot
                    if (
                        (increment > 0 && nextRotation > this.targetRotation) ||
                        (increment < 0 && nextRotation < this.targetRotation)
                    ) {
                        this.currentRotation = this.targetRotation;
                    } else {
                        this.currentRotation = nextRotation;
                    }

                    this.centralCubeElement.rotation[rotationAxis] = this.currentRotation;

                    if (Math.abs(this.currentRotation - this.targetRotation) > 0.01) {
                        requestAnimationFrame(animateLoop);
                    } else {
                        this.cubies.forEach((element) => {
                            this.scene.attach(element);
                        });
                        this.centralCubeElement.rotation.set(0, 0, 0);
                        this.currentRotation = 0;
                        this.isAnimating = false;
                        resolve();
                    }
                };

                requestAnimationFrame(animateLoop);
            } else {
                resolve();
            }
        });
    }

    findCubeSideElements(rotationAxis, cubeLayer) {
        const selectedObjects = [];

        let intervalX = (x) => true;
        let intervalY = (y) => true;
        let intervalZ = (z) => true;

        if (rotationAxis == "x") {
            if (cubeLayer < -0.5) {
                intervalX = (x) => x < -0.5;
            } else if (cubeLayer > 0.5) {
                intervalX = (x) => x > 0.5;
            } else {
                intervalX = (x) => -1.5 < x && x < 1.5;
            }
        }
        if (rotationAxis == "y") {
            if (cubeLayer < -0.5) {
                intervalY = (y) => y < -0.5;
            } else if (cubeLayer > 0.5) {
                intervalY = (y) => y > 0.5;
            } else {
                intervalY = (y) => -1.5 < y && y < 1.5;
            }
        }
        if (rotationAxis == "z") {
            if (cubeLayer < -0.5) {
                intervalZ = (z) => z < -0.5;
            } else if (cubeLayer > 0.5) {
                intervalZ = (z) => z > 0.5;
            } else {
                intervalZ = (z) => -1.5 < z && z < 1.5;
            }
        }

        this.cubies.forEach((object) => {
            if (object.isMesh) {
                const position = object.position;
                if (intervalX(position.x) && intervalY(position.y) && intervalZ(position.z)) {
                    selectedObjects.push(object);
                }
            }
        });

        return selectedObjects;
    }
}

export default RubikCubeController;
