class CubeValidator {
    static validate(cubieCube) {
        const result = {
            isSolved: true,
            corners: {
                correct: 0,
                badPosition: [],
                badOrientation: [],
            },
            edges: {
                correct: 0,
                badPosition: [],
                badOrientation: [],
            },
            details: [],
        };

        // Validate corners (0-7)
        for (let i = 0; i < 8; i++) {
            const corner = cubieCube.cubieCube.corners[i];
            const posCorrect = corner.pos === i;
            const oriCorrect = corner.ori === 0;

            if (posCorrect && oriCorrect) {
                result.corners.correct++;
            } else {
                result.isSolved = false;
                if (!posCorrect) {
                    result.corners.badPosition.push({
                        index: i,
                        currentPos: corner.pos,
                        expectedPos: i,
                    });
                }
                if (!oriCorrect) {
                    result.corners.badOrientation.push({
                        index: i,
                        currentOri: corner.ori,
                        expectedOri: 0,
                    });
                }
            }
        }

        // Validate edges (0-11)
        for (let i = 0; i < 12; i++) {
            const edge = cubieCube.cubieCube.edges[i];
            const posCorrect = edge.pos === i;
            const oriCorrect = edge.ori === 0;

            if (posCorrect && oriCorrect) {
                result.edges.correct++;
            } else {
                result.isSolved = false;
                if (!posCorrect) {
                    result.edges.badPosition.push({
                        index: i,
                        currentPos: edge.pos,
                        expectedPos: i,
                    });
                }
                if (!oriCorrect) {
                    result.edges.badOrientation.push({
                        index: i,
                        currentOri: edge.ori,
                        expectedOri: 0,
                    });
                }
            }
        }

        // Generate summary
        if (result.isSolved) {
            result.details.push("✓ Cube is SOLVED!");
        } else {
            if (result.corners.badPosition.length > 0) {
                result.details.push(
                    `✗ ${result.corners.badPosition.length} corners in wrong positions`
                );
            }
            if (result.corners.badOrientation.length > 0) {
                result.details.push(
                    `✗ ${result.corners.badOrientation.length} corners wrong orientation`
                );
            }
            if (result.edges.badPosition.length > 0) {
                result.details.push(
                    `✗ ${result.edges.badPosition.length} edges in wrong positions`
                );
            }
            if (result.edges.badOrientation.length > 0) {
                result.details.push(
                    `✗ ${result.edges.badOrientation.length} edges wrong orientation`
                );
            }
        }

        result.summary = result.details.join("\n");

        return result;
    }
}

export default CubeValidator;
