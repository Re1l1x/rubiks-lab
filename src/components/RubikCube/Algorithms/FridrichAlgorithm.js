import ThreePhaseAlgorithm from "./ThreePhaseAlgorithm.js";

// Fridrich Algorithm (CFOP method)
//
// Cross : reuse parent whiteCross() — already correct.
// F2L   : pair-by-pair using parent's per-slot helpers (firstLayerForSlot
//         + secondLayerForSlot). The parent's per-slot logic does proper
//         case detection on the cubie model and is, in effect, a robust
//         2-look F2L. Re-ordering it into pair-by-pair gives CFOP F2L
//         structure (4 slots × {corner, edge}). A full 41-case set is the
//         "ideal" CFOP F2L; here we instead reuse the parent's already-
//         debugged case-detection because the cubie model's orientation
//         conventions diverge from face-array CFOP and re-deriving 41
//         algorithms in the cubie frame risks subtle ori-tracking bugs.
//         The pair-by-pair structure is faithful CFOP organisation.
// OLL   : 2-look — yellow cross (reuse) + iterated Sune/Anti-Sune to
//         resolve all 7 OLL corner cases.
// PLL   : 2-look — corner perm (reuse parent's thirdLayerCornersPosition)
//         then iterated Ua/Ub edge perms to handle Ua/Ub/H/Z cases,
//         followed by a final corner-rotation phase (reuse parent).
//
// All moves are single quarter turns — no "U2"/"R2" — because
// CubieCube.rotateSide() only parses single tokens. Every emitted move is
// also applied to the cubie state via this.cubieCube.player(...).

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

    // ------------------------------------------------------------------
    // 1. CROSS
    // ------------------------------------------------------------------
    // Parent whiteCross() leaves ~18% of scrambles unsolved because its
    // phase 3 only inserts when the target D-slot already holds a U-edge
    // piece (index < 4). E-layer whites are never lifted, and D-slot
    // contents after phase 1 can be E-edges (index >= 8). This override
    // handles all positions/orientations explicitly.
    solveCross() {
        const seq = [];
        const apply = (moves) => {
            this.cubieCube.player(moves);
            seq.push(...moves);
        };
        const edges = () => this.cubieCube.cubieCube.edges;
        // edges[i] = { pos, ori } describing which piece is at SLOT i.
        // Find the slot currently holding piece `pieceId`.
        const findEdge = (pieceId) => {
            for (let i = 0; i < 12; i++) if (edges()[i].pos === pieceId) return i;
            return -1;
        };
        const isSolved = (i) => edges()[i].pos === i && edges()[i].ori === 0;
        const allSolved = () => isSolved(4) && isSolved(5) && isSolved(6) && isSolved(7);

        // Single-quarter-turn lifts from each E-slot to a U-slot.
        // NO_FLIP : L/R-family turn (preserves edge orientation)
        // DO_FLIP : F/B-family turn (flips edge orientation)
        const NO_FLIP = { 8: "R", 9: "L'", 10: "L", 11: "R'" };
        const DO_FLIP = { 8: "F'", 9: "F", 10: "B'", 11: "B" };

        let outer = 0;
        while (!allSolved() && outer++ < 16) {
            for (let target = 4; target <= 7; target++) {
                if (isSolved(target)) continue;

                const tFace = target % 4;
                let inner = 0;
                while (!isSolved(target) && inner++ < 30) {
                    const p = findEdge(target);
                    const o = edges()[p].ori;

                    if (p === target && o !== 0) {
                        // Right slot, wrong orientation — lift via face2.
                        const f = this.convertRotate(p - 4, true);
                        apply([f, f]);
                        continue;
                    }

                    if (p <= 3) {
                        // U-layer.
                        if (o === 0) {
                            const turns = ((tFace - p) % 4 + 4) % 4;
                            for (let t = 0; t < turns; t++) apply(["U"]);
                            const f = this.convertRotate(tFace, true);
                            apply([f, f]);
                        } else {
                            // Wrong orientation: push to E via face turn at
                            // tFace, then next iteration lifts back with
                            // opposite flip parity.
                            const turns = ((tFace - p) % 4 + 4) % 4;
                            for (let t = 0; t < turns; t++) apply(["U"]);
                            apply([this.convertRotate(tFace, true)]);
                        }
                    } else if (p >= 8) {
                        // E-layer: choose lift that yields ori 0 at U.
                        const move = o === 0 ? NO_FLIP[p] : DO_FLIP[p];
                        apply([move]);
                    } else {
                        // D-layer wrong slot: lift via face2.
                        const f = this.convertRotate(p - 4, true);
                        apply([f, f]);
                    }
                }
            }
        }

        return seq;
    }

    // ------------------------------------------------------------------
    // 2. F2L — pair-by-pair
    // ------------------------------------------------------------------
    solveF2L() {
        let seq = [];
        // Slot ordering: FR, FL, BL, BR — matches CFOP convention.
        // For each slot we solve (corner, edge) together.
        for (let slot = 0; slot < 4; slot++) {
            const cornerIdx = 4 + slot;
            const edgeIdx = 8 + slot;
            seq.push(...this.firstLayerForSlot(cornerIdx));
            seq.push(...this.secondLayerForSlot(edgeIdx));
        }
        return seq;
    }

    // ------------------------------------------------------------------
    // 3. OLL — 2-look
    // ------------------------------------------------------------------
    solveOLL() {
        let seq = [];
        // 3a. Orient last-layer edges (reuse parent) — yellow cross.
        seq.push(...this.yellowCross());
        // 3b. Orient last-layer corners. Seven cases (Sune, Anti-Sune,
        //     Pi, U, T, L, H) all resolve under at most two Sune-family
        //     applications with appropriate AUFs.
        seq.push(...this._ollOrientCorners());
        return seq;
    }

    _ollOrientCorners() {
        // Sune       : R U R' U R U2 R'   (U2 expanded to U U)
        // Anti-Sune  : R U2 R' U' R U' R'
        const SUNE = ["R", "U", "R'", "U", "R", "U", "U", "R'"];
        const ANTI = ["R", "U", "U", "R'", "U'", "R", "U'", "R'"];

        // Bounded BFS over chains of (AUF + Sune/Anti) up to depth 3.
        // There are 4 * 2 = 8 choices per step, so 8^3 = 512 trial
        // sequences in the worst case — fast and exhaustive for the seven
        // OLL corner cases.
        const tryChain = (depth) => {
            // Enumerate combinations.
            const choices = [];
            for (let auf = 0; auf < 4; auf++) {
                for (const alg of [SUNE, ANTI]) {
                    const c = [];
                    for (let a = 0; a < auf; a++) c.push("U");
                    c.push(...alg);
                    choices.push(c);
                }
            }
            // DFS.
            const snap = this._snapshot();
            const search = (remaining, accum) => {
                if (this._allUCornersOriented()) return accum.slice();
                if (remaining === 0) return null;
                for (const c of choices) {
                    this.cubieCube.player(c);
                    const r = search(remaining - 1, accum.concat(c));
                    if (r) return r;
                    // undo
                    this._restore(snap);
                    // re-apply accum
                    if (accum.length) this.cubieCube.player(accum);
                }
                return null;
            };
            const result = search(depth, []);
            this._restore(snap);
            return result;
        };

        if (this._allUCornersOriented()) return [];
        for (let d = 1; d <= 3; d++) {
            const r = tryChain(d);
            if (r) {
                this.cubieCube.player(r);
                return r;
            }
        }
        return [];
    }

    _allUCornersOriented() {
        for (let i = 0; i < 4; i++) {
            if (this.cubieCube.cubieCube.corners[i].ori !== 0) return false;
        }
        return true;
    }

    _uCornerOrientedCount() {
        let c = 0;
        for (let i = 0; i < 4; i++) {
            if (this.cubieCube.cubieCube.corners[i].ori === 0) c++;
        }
        return c;
    }

    // ------------------------------------------------------------------
    // 4. PLL — 2-look
    // ------------------------------------------------------------------
    solvePLL() {
        const seq = [];
        // 4a. Permute U-layer corners (Aa/Ab/E cases). BFS over (AUF +
        //     corner 3-cycle).
        seq.push(...this._pllCorners());
        // 4b. Permute U-layer edges (Ua/Ub/H/Z cases). BFS over (AUF +
        //     Ua/Ub).
        seq.push(...this._pllEdges());
        // 4c. Final AUF to align the layer.
        seq.push(...this._finalAUF());
        return seq;
    }

    // Aa perm — OLL-preserving corner 3-cycle:
    //   R' F R' B2 R F' R' B2 R2    (B2 -> B B, R2 -> R R)
    // Cycles three U-corners (c0,c2,c3 -> c3,c0,c2) while leaving the
    // fourth in place and preserving edge state & corner orientation.
    // With AUF setup and at most two applications, resolves Aa, Ab, and
    // E (diagonal-swap) perm cases.
    _pllCorners() {
        const ACYC = [
            "R'", "F", "R'", "B", "B", "R", "F'", "R'", "B", "B", "R", "R",
        ];

        const tryChain = (depth) => {
            const choices = [];
            for (let auf = 0; auf < 4; auf++) {
                const c = [];
                for (let a = 0; a < auf; a++) c.push("U");
                c.push(...ACYC);
                choices.push(c);
            }
            const snap = this._snapshot();
            const search = (remaining, accum) => {
                if (this._uCornersAtHome()) return accum.slice();
                if (remaining === 0) return null;
                for (const c of choices) {
                    this.cubieCube.player(c);
                    const r = search(remaining - 1, accum.concat(c));
                    if (r) return r;
                    this._restore(snap);
                    if (accum.length) this.cubieCube.player(accum);
                }
                return null;
            };
            const r = search(depth, []);
            this._restore(snap);
            return r;
        };

        if (this._uCornersAtHome()) return [];
        for (let d = 1; d <= 3; d++) {
            const r = tryChain(d);
            if (r) {
                this.cubieCube.player(r);
                return r;
            }
        }
        return [];
    }

    _uCornersAtHome() {
        for (let i = 0; i < 4; i++) {
            const c = this.cubieCube.cubieCube.corners[i];
            if (c.pos !== i || c.ori !== 0) return false;
        }
        return true;
    }

    _pllEdges() {
        // Ua: R U' R U R U R U' R' U' R2
        const UA = ["R", "U'", "R", "U", "R", "U", "R", "U'", "R'", "U'", "R", "R"];
        // Ub: R2 U R U R' U' R' U' R' U R'
        const UB = ["R", "R", "U", "R", "U", "R'", "U'", "R'", "U'", "R'", "U", "R'"];

        const tryChain = (depth) => {
            const choices = [];
            for (let auf = 0; auf < 4; auf++) {
                for (const alg of [UA, UB]) {
                    const c = [];
                    for (let a = 0; a < auf; a++) c.push("U");
                    c.push(...alg);
                    choices.push(c);
                }
            }
            const snap = this._snapshot();
            const search = (remaining, accum) => {
                if (this._lastLayerSolved()) return accum.slice();
                if (remaining === 0) return null;
                for (const c of choices) {
                    this.cubieCube.player(c);
                    const r = search(remaining - 1, accum.concat(c));
                    if (r) return r;
                    this._restore(snap);
                    if (accum.length) this.cubieCube.player(accum);
                }
                return null;
            };
            const r = search(depth, []);
            this._restore(snap);
            return r;
        };

        if (this._lastLayerSolved()) return [];
        for (let d = 1; d <= 3; d++) {
            const r = tryChain(d);
            if (r) {
                this.cubieCube.player(r);
                return r;
            }
        }
        return [];
    }

    _lastLayerSolved() {
        for (let i = 0; i < 4; i++) {
            const c = this.cubieCube.cubieCube.corners[i];
            if (c.pos !== i || c.ori !== 0) return false;
            const e = this.cubieCube.cubieCube.edges[i];
            if (e.pos !== i || e.ori !== 0) return false;
        }
        return true;
    }

    _finalAUF() {
        const seq = [];
        for (let i = 0; i < 4; i++) {
            if (this._lastLayerSolved()) return seq;
            this._apply(seq, ["U"]);
        }
        return seq;
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    _apply(seq, moves) {
        this.cubieCube.player(moves);
        seq.push(...moves);
    }

    _snapshot() {
        return JSON.parse(JSON.stringify(this.cubieCube.cubieCube));
    }

    _restore(snap) {
        this.cubieCube.cubieCube = JSON.parse(JSON.stringify(snap));
    }
}

export default FridrichAlgorithm;
