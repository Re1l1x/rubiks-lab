import * as THREE from "three";

class RubikCube {
    constructor() {
        //
        //                    ┌────┬────┬────┐
        //                    │ U1 │ U2 │ U3 │
        //                    ├────┼────┼────┤
        //                    │ U4 │ U5 │ U6 │
        //                    ├────┼────┼────┤
        //                    │ U7 │ U8 │ U9 │
        //                    └────┴────┴────┘
        //  ┌────┬────┬────┐  ┌────┬────┬────┐  ┌────┬────┬────┐  ┌────┬────┬────┐
        //  │ L1 │ L2 │ L3 │  │ F1 │ F2 │ F3 │  │ R1 │ R2 │ R3 │  │ B1 │ B2 │ B3 │
        //  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤
        //  │ L4 │ L5 │ L6 │  │ F4 │ F5 │ F6 │  │ R4 │ R5 │ R6 │  │ B4 │ B5 │ B6 │
        //  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤
        //  │ L7 │ L8 │ L9 │  │ F7 │ F8 │ F9 │  │ R7 │ R8 │ R9 │  │ B7 │ B8 │ B9 │
        //  └────┴────┴────┘  └────┴────┴────┘  └────┴────┴────┘  └────┴────┴────┘
        //                    ┌────┬────┬────┐
        //                    │ D1 │ D2 │ D3 │
        //                    ├────┼────┼────┤
        //                    │ D4 │ D5 │ D6 │
        //                    ├────┼────┼────┤
        //                    │ D7 │ D8 │ D9 │
        //                    └────┴────┴────┘
        //
        this.cubeSides = {
            front: ["R", "R", "R", "R", "R", "R", "R", "R", "R"],
            back: ["O", "O", "O", "O", "O", "O", "O", "O", "O"],
            left: ["B", "B", "B", "B", "B", "B", "B", "B", "B"],
            right: ["G", "G", "G", "G", "G", "G", "G", "G", "G"],
            up: ["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"],
            down: ["W", "W", "W", "W", "W", "W", "W", "W", "W"],
        };
    }

    convertFrom3DCube(stickers) {
        // prettier-ignore
        let sides = {
            "-x": "back",
            "x": "front",
            "-y": "down",
            "y": "up",
            "-z": "right",
            "z": "left",
        };

        stickers.forEach((sticker) => {
            let worldPosition = new THREE.Vector3();
            sticker.getWorldPosition(worldPosition);
            console.log(sticker);
            let cubeSide = this.getDominantDirection(worldPosition);
            let cubeSideCoordinates = this.getCubeSideCoordinates(worldPosition, cubeSide);
            let arrayIndex = (cubeSideCoordinates.x + 1) * 3 + cubeSideCoordinates.y + 1;
            this.cubeSides[sides[cubeSide]][arrayIndex] = sticker.material.name[0];
        });

        // console.log(this.cubeSides);
        // this.rotateSide("front", true);
        // console.log(this.cubeSides);
    }

    getDominantDirection(vector) {
        const directions = [
            { direction: "x", value: Math.abs(vector.x), originalValue: vector.x },
            { direction: "y", value: Math.abs(vector.y), originalValue: vector.y },
            { direction: "z", value: Math.abs(vector.z), originalValue: vector.z },
        ];

        const dominant = directions.reduce((prev, current) => {
            return prev.value > current.value ? prev : current;
        });

        return (dominant.originalValue < 0 ? "-" : "") + dominant.direction;
    }

    getCubeSideCoordinates(vector3, cubeSide) {
        let vector2 = new THREE.Vector2(0, 0);

        if (cubeSide.includes("x")) {
            vector2.x = -Math.round(vector3.y);
            vector2.y = (cubeSide.includes("-") ? 1 : -1) * Math.round(vector3.z);
        } else if (cubeSide.includes("y")) {
            vector2.x = (cubeSide.includes("-") ? -1 : 1) * Math.round(vector3.x);
            vector2.y = -Math.round(vector3.z);
        } else if (cubeSide.includes("z")) {
            vector2.x = -Math.round(vector3.y);
            vector2.y = (cubeSide.includes("-") ? -1 : 1) * Math.round(vector3.x);
        }

        return vector2;
    }

    //     rotateSide(cubeSide, clockwiseDirection) {
    //         const neighbors = {
    //             front: { U: [up, [6, 7, 8]], D: [down, [2, 1, 0]], L: [left, [8, 5, 2]], R: [right, [0, 3, 6]] },
    //             back: { up: [2, 1, 0], down: [6, 7, 8], left: [0, 1, 2], right: [8, 7, 6] },
    //             left: { up: [0, 3, 6], down: [0, 3, 6], front: [0, 3, 6], back: [8, 5, 2] },
    //             right: { up: [2, 5, 8], down: [0, 3, 6], front: [2, 5, 8], back: [0, 3, 6] }, // доделать
    //             up: { front: [0, 1, 2], back: [6, 7, 8], left: [0, 1, 2], right: [6, 7, 8] },
    //             down: { front: [6, 7, 8], back: [0, 1, 2], left: [6, 7, 8], right: [0, 1, 2] },
    //         };

    //         // const temp = [...this.cubeSides[cubeSide]];
    //         const temp = [0, this.cubeSides[neighbors[cubeSide][U][0]][neighbors[cubeSide][U][1][0]]];
    //         console.log(neighbors);

    //         // const tempNeighbors = {
    //         //     up: this.cubeSides[neighbors[cubeSide].up[0]].slice(),
    //         //     down: this.cubeSides[neighbors[cubeSide].down[0]].slice(),
    //         //     left: this.cubeSides[neighbors[cubeSide].left[0]].slice(),
    //         //     right: this.cubeSides[neighbors[cubeSide].right[0]].slice(),
    //         // };

    //         if (clockwiseDirection) {
    //             this.cubeSides[cubeSide] = [
    //                 temp[6],
    //                 temp[3],
    //                 temp[0],
    //                 temp[7],
    //                 temp[4],
    //                 temp[1],
    //                 temp[8],
    //                 temp[5],
    //                 temp[2],
    //             ];

    //             // for (const [key, indices] of Object.entries(neighbors[cubeSide])) {
    //             //     for (let i = 0; i < indices.length; i++) {
    //             //         this.cubeSides[key][indices[i]] = tempNeighbors[neighbors[cubeSide][key]][(i + 1) % 3];
    //             //     }
    //             // }
    //         }
    //         //                    ┌────┬────┬────┐
    //         //                    │ U1 │ U2 │ U3 │
    //         //                    ├────┼────┼────┤
    //         //                    │ U4 │ U5 │ U6 │
    //         //                    ├────┼────┼────┤
    //         //                    │ U7 │ U8 │ U9 │
    //         //                    └────┴────┴────┘
    //         //  ┌────┬────┬────┐  ┌────┬────┬────┐  ┌────┬────┬────┐  ┌────┬────┬────┐
    //         //  │ L1 │ L2 │ L3 │  │ F1 │ F2 │ F3 │  │ R1 │ R2 │ R3 │  │ B1 │ B2 │ B3 │
    //         //  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤
    //         //  │ L4 │ L5 │ L6 │  │ F4 │ F5 │ F6 │  │ R4 │ R5 │ R6 │  │ B4 │ B5 │ B6 │
    //         //  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤  ├────┼────┼────┤
    //         //  │ L7 │ L8 │ L9 │  │ F7 │ F8 │ F9 │  │ R7 │ R8 │ R9 │  │ B7 │ B8 │ B9 │
    //         //  └────┴────┴────┘  └────┴────┴────┘  └────┴────┴────┘  └────┴────┴────┘
    //         //                    ┌────┬────┬────┐
    //         //                    │ D1 │ D2 │ D3 │
    //         //                    ├────┼────┼────┤
    //         //                    │ D4 │ D5 │ D6 │
    //         //                    ├────┼────┼────┤
    //         //                    │ D7 │ D8 │ D9 │
    //         //                    └────┴────┴────┘
    //         //
    //     }
}

export default RubikCube;
