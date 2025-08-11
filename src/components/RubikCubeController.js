import { PI } from "three/tsl";

class RubikCubeController {
    constructor() {
        this.cube = cube;
    }

    rotate(axis, angle) {
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axis, angle);
        this.cube.quaternion.multiplyQuaternions(
            quaternion,
            this.cube.quaternion
        );
    }

    rotateObjectsAroundCenter() {
        const objects = findObjectsInRange();
        const angle = Math.PI / 2;
        if (objects.length === 0) return;

        // Шаг 1: Вычисление общего центра
        const center = new THREE.Vector3();
        objects.forEach((object) => {
            center.add(object.position);
        });
        center.divideScalar(objects.length);

        objects.forEach((object) => {
            object.position.sub(center);
        });

        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        objects.forEach((object) => {
            object.quaternion.multiplyQuaternions(
                quaternion,
                object.quaternion
            );
        });

        objects.forEach((object) => {
            object.position.add(center);
        });
    }

    findObjectsInRange() {
        const selectedObjects = [];

        this.scene.traverse((object) => {
            if (object.isMesh) {
                const position = object.position;

                if (position.y >= 1) {
                    selectedObjects.push(object);
                }
            }
        });

        return selectedObjects;
    }
}

export default RubikCubeController;
