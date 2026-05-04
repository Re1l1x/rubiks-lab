// Test script for Rubik's Cube algorithms
// Run with: node test-algorithms.mjs

// Mock THREE.Vector3 for Node.js environment
if (typeof global !== 'undefined' && !global.THREE) {
    global.THREE = {
        Vector3: class {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        },
    };
}

import CubieCube from './src/components/RubikCube/CubieCube.js';
import ThreePhaseAlgorithm from './src/components/RubikCube/Algorithms/ThreePhaseAlgorithm.js';
import FridrichAlgorithm from './src/components/RubikCube/Algorithms/FridrichAlgorithm.js';

class CubeValidator {
    static validate(cubieCube) {
        let isSolved = true;
        let issues = [];

        for (let i = 0; i < 8; i++) {
            const corner = cubieCube.cubieCube.corners[i];
            if (corner.pos !== i || corner.ori !== 0) {
                isSolved = false;
                issues.push(`Corner ${i}: pos=${corner.pos} (expected ${i}), ori=${corner.ori} (expected 0)`);
            }
        }

        for (let i = 0; i < 12; i++) {
            const edge = cubieCube.cubieCube.edges[i];
            if (edge.pos !== i || edge.ori !== 0) {
                isSolved = false;
                issues.push(`Edge ${i}: pos=${edge.pos} (expected ${i}), ori=${edge.ori} (expected 0)`);
            }
        }

        return { isSolved, issues };
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function scrambleCube(cubieCube, moves = 20) {
    const faces = ['F', 'B', 'L', 'R', 'U', 'D'];
    const sequence = [];

    for (let i = 0; i < moves; i++) {
        const face = faces[getRandomInt(0, 5)];
        const prime = getRandomInt(0, 1) === 1 ? "'" : '';
        sequence.push(face + prime);
    }

    cubieCube.player(sequence);
    return sequence;
}

async function testAlgorithm(algorithmName, AlgorithmClass) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing ${algorithmName}`);
    console.log('='.repeat(60));

    const testCases = 5;
    let passed = 0;
    let failed = 0;

    for (let testNum = 1; testNum <= testCases; testNum++) {
        try {
            const cube = new CubieCube();
            const scramble = scrambleCube(cube, 15);
            console.log(`\nTest ${testNum}:`);
            console.log(`  Scramble (${scramble.length} moves): ${scramble.slice(0, 10).join(' ')}${scramble.length > 10 ? '...' : ''}`);

            const algorithm = new AlgorithmClass(cube);
            const solution = algorithm.solveCube();
            console.log(`  Solution: ${solution.length} moves`);

            const validation = CubeValidator.validate(cube);

            if (validation.isSolved) {
                console.log(`  ✓ PASSED - Cube solved`);
                passed++;
            } else {
                console.log(`  ✗ FAILED - Cube not solved`);
                if (validation.issues.length <= 3) {
                    validation.issues.forEach((issue) => {
                        console.log(`    - ${issue}`);
                    });
                } else {
                    console.log(`    - ${validation.issues.length} issues found`);
                    validation.issues.slice(0, 2).forEach((issue) => {
                        console.log(`    - ${issue}`);
                    });
                    console.log(`    - ... and ${validation.issues.length - 2} more`);
                }
                failed++;
            }
        } catch (error) {
            console.log(`  ✗ ERROR: ${error.message}`);
            console.log(`    ${error.stack.split('\n')[1]}`);
            failed++;
        }
    }

    console.log(`\n${algorithmName} Results: ${passed}/${testCases} passed`);
    return { passed, failed };
}

async function main() {
    console.log('\n🧪 Rubik\'s Cube Solver Tests');
    console.log('Testing algorithms with random scrambles\n');

    const results = {
        'Layer-by-Layer': await testAlgorithm('Layer-by-Layer', ThreePhaseAlgorithm),
        'Fridrich (CFOP)': await testAlgorithm('Fridrich (CFOP)', FridrichAlgorithm),
    };

    console.log(`\n${'='.repeat(60)}`);
    console.log('SUMMARY');
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    Object.entries(results).forEach(([name, result]) => {
        const total = result.passed + result.failed;
        const percentage = total > 0 ? ((result.passed / total) * 100).toFixed(0) : 0;
        console.log(`${name}: ${result.passed}/${total} ✓ (${percentage}%)`);
        totalPassed += result.passed;
        totalFailed += result.failed;
    });

    const total = totalPassed + totalFailed;
    const totalPercentage = total > 0 ? ((totalPassed / total) * 100).toFixed(0) : 0;
    console.log(`\nTotal: ${totalPassed}/${total} ✓ (${totalPercentage}%)`);

    if (totalFailed === 0) {
        console.log('\n✅ All tests passed!');
        process.exit(0);
    } else {
        console.log(`\n❌ ${totalFailed} test(s) failed`);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
});
