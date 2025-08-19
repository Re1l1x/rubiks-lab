class RubikCubeController {
    constructor(scene, cubeElements, mainCubeElement, animations, animationDuration) {
        this.scene = scene;
        this.cubeElements = cubeElements;
        this.mainCubeElement = mainCubeElement;
        this.animations = animations;
        this.animationDuration = animationDuration;
        this.isAnimating = false;
    }

    scramble() {
        let cubeSides = ["x", "-x", "y", "-y", "z", "-z"];
        let clockwiseDirections = [true, false];

        for (let i = 0; i < 30; i++) {
            setTimeout(
                () => {
                    let cubeSideNum = this.getRandomInt(0, 5);
                    let clockwiseDirectionNum = this.getRandomInt(0, 1);
                    console.log(i);
                    this.rotateSide(cubeSides[cubeSideNum], clockwiseDirections[clockwiseDirectionNum]);
                },
                this.animationDuration * 500 * i
            );
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rotateSide(cubeSide, clockwiseDirection) {
        if (!this.isAnimating) {
            this.isAnimating = true;

            const cubeSideElements = this.findCubeSideElements(cubeSide);
            const animation = this.findAnimation(cubeSide, clockwiseDirection);

            cubeSideElements.forEach((element) => {
                this.mainCubeElement.attach(element);
            });

            animation.play();
            setTimeout(() => {
                // console.log("Анимация завершена!");
                cubeSideElements.forEach((element) => {
                    this.scene.attach(element);
                });
                animation.stop();
                this.isAnimating = false;
            }, this.animationDuration * 500);
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
