import ThreePhaseAlgorithm from "./ThreePhaseAlgorithm.js";

// Fridrich Algorithm (CFOP method)
// Conceptually organized as CFOP phases but uses ThreePhaseAlgorithm methods:
// F2L: whiteCross + firstLayer + secondLayer
// OLL: yellowCross + corner orientation
// PLL: correctYellowCross + corner/edge permutation

class FridrichAlgorithm extends ThreePhaseAlgorithm {
    constructor(cubieCube) {
        super(cubieCube);
    }

    solveCube() {
        let solutionSequence = [];

        // CFOP Phase 1: F2L (First Two Layers)
        solutionSequence = solutionSequence.concat(this.whiteCross());
        solutionSequence = solutionSequence.concat(this.firstLayer());
        solutionSequence = solutionSequence.concat(this.secondLayer());

        // CFOP Phase 2: OLL (Orient Last Layer)
        solutionSequence = solutionSequence.concat(this.yellowCross());

        // CFOP Phase 3: PLL (Permute Last Layer)
        solutionSequence = solutionSequence.concat(this.correctYellowCross());
        solutionSequence = solutionSequence.concat(this.thirdLayerCornersPosition());
        solutionSequence = solutionSequence.concat(this.thirdLayerCornersRotation());

        return solutionSequence;
    }
}

export default FridrichAlgorithm;
