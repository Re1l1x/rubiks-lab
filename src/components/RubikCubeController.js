class RubikCubeController {
    constructor(scene, cubeElements, mainCubeElement) {
        this.scene = scene;
        this.cubeElements = cubeElements;
        this.mainCubeElement = mainCubeElement;

        this.isAnimating = false;
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.rotationSpeed = Math.PI / 60;
        this.cubeSide = "";
    }

    scramble() {
        let cubeSides = ["x", "-x", "y", "-y", "z", "-z"];
        let clockwiseDirections = [true, false];

        for (let i = 0; i < 30; i++) {
            setTimeout(
                () => {
                    let cubeSideNum = this.getRandomInt(0, 5);
                    let clockwiseDirectionNum = this.getRandomInt(0, 1);
                    this.rotateSide(cubeSides[cubeSideNum], clockwiseDirections[clockwiseDirectionNum]);
                },
                this.animationDuration * 600 * i
            );
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rotateSide(cubeSide, clockwiseDirection) {
        if (!this.isAnimating) {
            this.cubeSide = cubeSide;

            const cubeSideElements = this.findCubeSideElements(cubeSide);
            cubeSideElements.forEach((element) => {
                this.mainCubeElement.attach(element);
            });
            this.targetRotation = Math.PI / 2;

            this.isAnimating = true;
        }
    }

    animate() {
        if (this.isAnimating) {
            if (Math.abs(this.currentRotation - this.targetRotation) > 0.01) {
                this.currentRotation += this.rotationSpeed;
                if (this.cubeSide.includes("x")) {
                    this.mainCubeElement.rotation.x = this.currentRotation;
                } else if (this.cubeSide.includes("y")) {
                    this.mainCubeElement.rotation.y = this.currentRotation;
                } else if (this.cubeSide.includes("z")) {
                    this.mainCubeElement.rotation.z = this.currentRotation;
                }
            } else {
                this.cubeElements.forEach((element) => {
                    this.scene.attach(element);
                });
                this.mainCubeElement.rotation.set(0, 0, 0);
                this.currentRotation = 0;
                this.isAnimating = false;
            }
        }
    }

    findCubeSideElements(direction) {
        const selectedObjects = [];

        this.cubeElements.forEach((object) => {
            if (object.isMesh) {
                const position = object.position;
                if (direction == "x" && position.x >= 0.5) {
                    selectedObjects.push(object);
                } else if (direction == "-x" && position.x <= -0.5) {
                    selectedObjects.push(object);
                } else if (direction == "y" && position.y >= 0.5) {
                    selectedObjects.push(object);
                } else if (direction == "-y" && position.y <= -0.5) {
                    selectedObjects.push(object);
                } else if (direction == "z" && position.z >= 0.5) {
                    selectedObjects.push(object);
                } else if (direction == "-z" && position.z <= -0.5) {
                    selectedObjects.push(object);
                }
            }
        });

        return selectedObjects;
    }

    findAnimation(direction, clockwiseDirection) {
        let animationName = "Rotation";

        if (!direction.includes("-")) {
            animationName += (clockwiseDirection ? "" : "-") + direction.toUpperCase();
        } else {
            animationName += (!clockwiseDirection ? "" : "-") + direction[1].toUpperCase();
        }

        return this.animations.find((item) => item._clip.name === animationName);
    }
}

export default RubikCubeController;
