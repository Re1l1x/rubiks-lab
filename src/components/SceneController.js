import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class SceneController {
    constructor(camera, renderer, domElement) {
        this.controls = new OrbitControls(camera, domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.screenSpacePanning = true;
    }

    update() {
        this.controls.update();
    }

    dispose() {
        this.controls.dispose();
    }
}

export default SceneController;
