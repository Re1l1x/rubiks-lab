class RubikCubeController {
    constructor(scene, cubeElements, mainCubeElement, animations, animationDuration) {
        this.scene = scene;
        this.cubeElements = cubeElements;
        this.mainCubeElement = mainCubeElement;
        this.animations = animations;
        this.animationDuration = animationDuration;
    }

    rotateSide(cubeSide, clockwiseDirection) {
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
        }, this.animationDuration * 1000);
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
