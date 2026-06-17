import * as THREE from "three";

class CubieCube {
    constructor() {
        this.cubieCube = {
            corners: [
                { pos: 0, ori: 0 }, // UFR
                { pos: 1, ori: 0 }, // UFL
                { pos: 2, ori: 0 }, // UBL
                { pos: 3, ori: 0 }, // UBR
                { pos: 4, ori: 0 }, // DFR
                { pos: 5, ori: 0 }, // DFL
                { pos: 6, ori: 0 }, // DBL
                { pos: 7, ori: 0 }, // DBR
            ],
            edges: [
                { pos: 0, ori: 0 }, // UF
                { pos: 1, ori: 0 }, // UL
                { pos: 2, ori: 0 }, // UB
                { pos: 3, ori: 0 }, // UR
                { pos: 4, ori: 0 }, // DF
                { pos: 5, ori: 0 }, // DL
                { pos: 6, ori: 0 }, // DB
                { pos: 7, ori: 0 }, // DR
                { pos: 8, ori: 0 }, // FR
                { pos: 9, ori: 0 }, // FL
                { pos: 10, ori: 0 }, // BL
                { pos: 11, ori: 0 }, // BR
            ],
        };

        this.cornerCoords = [
            (x, y, z) => x > 0.5 && y > 0.5 && z < -0.5, // UFR
            (x, y, z) => x > 0.5 && y > 0.5 && z > 0.5, // UFL
            (x, y, z) => x < -0.5 && y > 0.5 && z > 0.5, // UBL
            (x, y, z) => x < -0.5 && y > 0.5 && z < -0.5, // UBR
            (x, y, z) => x > 0.5 && y < -0.5 && z < -0.5, // DFR
            (x, y, z) => x > 0.5 && y < -0.5 && z > 0.5, // DFL
            (x, y, z) => x < -0.5 && y < -0.5 && z > 0.5, // DBL
            (x, y, z) => x < -0.5 && y < -0.5 && z < -0.5, // DBR
        ];

        this.edgeCoords = [
            (x, y, z) => x > 0.5 && y > 0.5 && Math.abs(z) < 0.5, // UF
            (x, y, z) => Math.abs(x) < 0.5 && y > 0.5 && z > 0.5, // UL
            (x, y, z) => x < -0.5 && y > 0.5 && Math.abs(z) < 0.5, // UB
            (x, y, z) => Math.abs(x) < 0.5 && y > 0.5 && z < -0.5, // UR
            (x, y, z) => x > 0.5 && y < -0.5 && Math.abs(z) < 0.5, // DF
            (x, y, z) => Math.abs(x) < 0.5 && y < -0.5 && z > 0.5, // DL
            (x, y, z) => x < -0.5 && y < -0.5 && Math.abs(z) < 0.5, // DB
            (x, y, z) => Math.abs(x) < 0.5 && y < -0.5 && z < -0.5, // DR
            (x, y, z) => x > 0.5 && Math.abs(y) < 0.5 && z < -0.5, // FR
            (x, y, z) => x > 0.5 && Math.abs(y) < 0.5 && z > 0.5, // FL
            (x, y, z) => x < -0.5 && Math.abs(y) < 0.5 && z > 0.5, // BL
            (x, y, z) => x < -0.5 && Math.abs(y) < 0.5 && z < -0.5, // BR
        ];

        this.cornerColorTable = [
            ["U", "F", "R"], // UFR
            ["U", "L", "F"], // UFL
            ["U", "B", "L"], // UBL
            ["U", "R", "B"], // UBR
            ["D", "R", "F"], // DFR
            ["D", "F", "L"], // DFL
            ["D", "L", "B"], // DBL
            ["D", "B", "R"], // DBR
        ];

        this.edgeColorTable = [
            ["U", "F"], // UF
            ["U", "L"], // UL
            ["U", "B"], // UB
            ["U", "R"], // UR
            ["D", "F"], // DF
            ["D", "L"], // DL
            ["D", "B"], // DB
            ["D", "R"], // DR
            ["F", "R"], // FR
            ["F", "L"], // FL
            ["B", "L"], // BL
            ["B", "R"], // BR
        ];

        this.colorMap = {
            Yellow: "U",
            White: "D",
            Red: "F",
            Orange: "B",
            Green: "R",
            Blue: "L",
        };
    }

    convertFrom3DCube(cubies) {
        cubies.forEach((cube) => {
            if (cube.name.includes("Corner")) {
                let index = this.findCoords(cube.position, this.cornerCoords);
                let pos = this.findPos(cube.children, this.cornerColorTable);
                this.cubieCube.corners[index].pos = pos;
                let ori = this.findOri(cube.children, this.cornerColorTable, pos, index);
                this.cubieCube.corners[index].ori = ori;
            } else if (cube.name.includes("Edge")) {
                let index = this.findCoords(cube.position, this.edgeCoords);
                let pos = this.findPos(cube.children, this.edgeColorTable);
                this.cubieCube.edges[index].pos = pos;
                let ori = this.findOri(cube.children, this.edgeColorTable, pos, index);
                this.cubieCube.edges[index].ori = ori;
            }
        });

        // this.rotateSide("");

        console.log(this.cubieCube);
    }

    convertTo3DCube(cubies) {}

    findCoords(position, coords) {
        for (let i = 0; i < coords.length; i++) {
            if (coords[i](position.x, position.y, position.z)) {
                return i;
            }
        }
        return -1;
    }

    findPos(stickers, table) {
        let colors = stickers.map((sticker) => sticker.userData.color).sort();
        for (let i = 0; i < table.length; i++) {
            if (JSON.stringify(colors) == JSON.stringify(table[i].slice().sort())) {
                return i;
            }
        }
        return -1;
    }

    findOri(stickers, table, pos, index) {
        let referenceDirection;
        if (index < 8) {
            referenceDirection = "y";
        } else {
            referenceDirection = "x";
        }
        for (let i = 0; i < stickers.length; i++) {
            let worldPosition = new THREE.Vector3();
            stickers[i].getWorldPosition(worldPosition);
            // console.log(this.getDominantDirection(worldPosition), referenceDirection);
            if (this.getDominantDirection(worldPosition) == referenceDirection) {
                // console.log(stickers[i].userData.color, table[pos]);
                for (let j = 0; j < table[pos].length; j++) {
                    // console.log(stickers[i].userData.color, table[pos][j]);
                    if (stickers[i].userData.color == table[pos][j]) {
                        return j;
                    }
                }
            }
        }
        return -1;
    }

    getDominantDirection(vector) {
        const directions = [
            { direction: "x", value: Math.abs(vector.x) },
            { direction: "y", value: Math.abs(vector.y) },
            { direction: "z", value: Math.abs(vector.z) },
        ];

        const dominant = directions.reduce((prev, current) => {
            return prev.value > current.value ? prev : current;
        });

        return dominant.direction;
    }

    findCorner(pos) {
        for (let i = 0; i < 8; i++) {
            if (this.cubieCube.corners[i].pos == pos) {
                return i;
            }
        }
    }

    findEdge(pos) {
        for (let i = 0; i < 12; i++) {
            if (this.cubieCube.edges[i].pos == pos) {
                return i;
            }
        }
    }

    player(sequence) {
        for (let i = 0; i < sequence.length; i++) {
            this.rotateSide(sequence[i]);
        }
    }

    rotateSide(move) {
        let cornerIndices;
        let edgeIndices;
        if (move.includes("U")) {
            cornerIndices = [0, 1, 2, 3];
            edgeIndices = [0, 1, 2, 3];
        } else if (move.includes("D")) {
            cornerIndices = [4, 7, 6, 5];
            edgeIndices = [4, 7, 6, 5];
        } else if (move.includes("F")) {
            cornerIndices = [1, 0, 4, 5];
            edgeIndices = [0, 8, 4, 9];
        } else if (move.includes("B")) {
            cornerIndices = [3, 2, 6, 7];
            edgeIndices = [2, 10, 6, 11];
        } else if (move.includes("R")) {
            cornerIndices = [0, 3, 7, 4];
            edgeIndices = [3, 11, 7, 8];
        } else if (move.includes("L")) {
            cornerIndices = [2, 1, 5, 6];
            edgeIndices = [1, 9, 5, 10];
        }

        if (!move.includes("'")) {
            let tempCornerPos = this.cubieCube.corners[cornerIndices[3]];
            let tempEdge = this.cubieCube.edges[edgeIndices[3]];
            for (let i = 2; i >= 0; i--) {
                this.cubieCube.corners[cornerIndices[i + 1]] = this.cubieCube.corners[cornerIndices[i]];
                this.cubieCube.edges[edgeIndices[i + 1]] = this.cubieCube.edges[edgeIndices[i]];
            }
            this.cubieCube.corners[cornerIndices[0]] = tempCornerPos;
            this.cubieCube.edges[edgeIndices[0]] = tempEdge;
        } else {
            let tempCorner = this.cubieCube.corners[cornerIndices[0]];
            let tempEdge = this.cubieCube.edges[edgeIndices[0]];
            for (let i = 0; i < 3; i++) {
                this.cubieCube.corners[cornerIndices[i]] = this.cubieCube.corners[cornerIndices[i + 1]];
                this.cubieCube.edges[edgeIndices[i]] = this.cubieCube.edges[edgeIndices[i + 1]];
            }
            this.cubieCube.corners[cornerIndices[3]] = tempCorner;
            this.cubieCube.edges[edgeIndices[3]] = tempEdge;
        }

        if (move.includes("F")) {
            this.cubieCube.corners[1].ori = (this.cubieCube.corners[1].ori + 2) % 3;
            this.cubieCube.corners[0].ori = (this.cubieCube.corners[0].ori + 1) % 3;
            this.cubieCube.corners[4].ori = (this.cubieCube.corners[4].ori + 2) % 3;
            this.cubieCube.corners[5].ori = (this.cubieCube.corners[5].ori + 1) % 3;
            this.cubieCube.edges[0].ori = (this.cubieCube.edges[0].ori + 1) % 2;
            this.cubieCube.edges[8].ori = (this.cubieCube.edges[8].ori + 1) % 2;
            this.cubieCube.edges[4].ori = (this.cubieCube.edges[4].ori + 1) % 2;
            this.cubieCube.edges[9].ori = (this.cubieCube.edges[9].ori + 1) % 2;
        } else if (move.includes("B")) {
            this.cubieCube.corners[3].ori = (this.cubieCube.corners[3].ori + 2) % 3;
            this.cubieCube.corners[2].ori = (this.cubieCube.corners[2].ori + 1) % 3;
            this.cubieCube.corners[6].ori = (this.cubieCube.corners[6].ori + 2) % 3;
            this.cubieCube.corners[7].ori = (this.cubieCube.corners[7].ori + 1) % 3;
            this.cubieCube.edges[2].ori = (this.cubieCube.edges[2].ori + 1) % 2;
            this.cubieCube.edges[10].ori = (this.cubieCube.edges[10].ori + 1) % 2;
            this.cubieCube.edges[6].ori = (this.cubieCube.edges[6].ori + 1) % 2;
            this.cubieCube.edges[11].ori = (this.cubieCube.edges[11].ori + 1) % 2;
        } else if (move.includes("R")) {
            this.cubieCube.corners[0].ori = (this.cubieCube.corners[0].ori + 2) % 3;
            this.cubieCube.corners[3].ori = (this.cubieCube.corners[3].ori + 1) % 3;
            this.cubieCube.corners[7].ori = (this.cubieCube.corners[7].ori + 2) % 3;
            this.cubieCube.corners[4].ori = (this.cubieCube.corners[4].ori + 1) % 3;
        } else if (move.includes("L")) {
            this.cubieCube.corners[2].ori = (this.cubieCube.corners[2].ori + 2) % 3;
            this.cubieCube.corners[1].ori = (this.cubieCube.corners[1].ori + 1) % 3;
            this.cubieCube.corners[5].ori = (this.cubieCube.corners[5].ori + 2) % 3;
            this.cubieCube.corners[6].ori = (this.cubieCube.corners[6].ori + 1) % 3;
        }
    }
}

export default CubieCube;
