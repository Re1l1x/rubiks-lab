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

            for (let i = 0; i < 30; i++) {
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
                    if (Math.abs(this.currentRotation - this.targetRotation) > 0.01) {
                        this.currentRotation +=
                            (cubeLayer == -1 ? 1 : -1) * (clockwiseDirection ? 1 : -1) * this.rotationSpeed;
                        this.centralCubeElement.rotation[rotationAxis] = this.currentRotation;
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
