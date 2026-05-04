import ThreePhaseAlgorithm from "./ThreePhaseAlgorithm.js";

// Fridrich Algorithm (CFOP method)
// Cross  : white cross on D
// F2L    : 4 corner-edge pairs solved slot-by-slot (real CFOP organization)
// OLL    : 2-look — orient last-layer edges, then corners
// PLL    : 2-look — permute last-layer edges, then corners
//
// Slot order: DFR(4)+FR(8) → DFL(5)+FL(9) → DBL(6)+BL(10) → DBR(7)+BR(11)

class FridrichAlgorithm extends ThreePhaseAlgorithm {
    constructor(cubieCube) {
        super(cubieCube);
    }

    solveCube() {
        let seq = [];

        seq.push(...this.solveCross());
        seq.push(...this.solveF2L());
        seq.push(...this.solveOLL());
        seq.push(...this.solvePLL());

        return seq;
    }

    solveCross() {
        return this.whiteCross();
    }

    solveF2L() {
        let seq = [];
        for (let slot = 0; slot < 4; slot++) {
            const cornerIdx = 4 + slot;
            const edgeIdx = 8 + slot;
            seq.push(...this.solveF2LSlot(cornerIdx, edgeIdx));
        }
        return seq;
    }

    solveF2LSlot(cornerIdx, edgeIdx) {
        let seq = [];
        seq.push(...this.firstLayerForSlot(cornerIdx));
        seq.push(...this.secondLayerForSlot(edgeIdx));
        return seq;
    }

    solveOLL() {
        let seq = [];
        seq.push(...this.yellowCross());
        return seq;
    }

    solvePLL() {
        let seq = [];
        seq.push(...this.correctYellowCross());
        seq.push(...this.thirdLayerCornersPosition());
        seq.push(...this.thirdLayerCornersRotation());
        return seq;
    }
}

export default FridrichAlgorithm;
