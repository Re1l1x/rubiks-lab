class ThreePhaseAlgorithm {
    constructor(cubieCube) {
        this.cubieCube = cubieCube;
    }

    solveCube() {
        let solutionSequence = [];

        solutionSequence = solutionSequence.concat(this.whiteСross());
        solutionSequence = solutionSequence.concat(this.firstLayer());
        solutionSequence = solutionSequence.concat(this.secondLayer());
        solutionSequence = solutionSequence.concat(this.yellowCross());
        solutionSequence = solutionSequence.concat(this.correctYellowCross());

        return solutionSequence;
    }

    whiteСross() {
        let sequence = [];

        for (let i = 4; i < 8; i++) {
            // i == index
            let tempSequence = [];
            if (3 < this.cubieCube.cubieCube.edges[i].pos && this.cubieCube.cubieCube.edges[i].pos < 8) {
                while (
                    3 < this.cubieCube.cubieCube.edges[i % 4].pos &&
                    this.cubieCube.cubieCube.edges[i % 4].pos < 8
                ) {
                    sequence.push("U");
                    this.cubieCube.player(["U"]);
                }
                tempSequence.push(...[this.convertRotate(i % 4, true), this.convertRotate(i % 4, true)]);
            }
            this.cubieCube.player(tempSequence);
            sequence.push(...tempSequence);
        }

        for (let i = 8; i < 12; i++) {
            // i == index
            let tempSequence = [];
            if (3 < this.cubieCube.cubieCube.edges[i].pos && this.cubieCube.cubieCube.edges[i].pos < 8) {
                while (
                    3 < this.cubieCube.cubieCube.edges[i % 4].pos &&
                    this.cubieCube.cubieCube.edges[i % 4].pos < 8
                ) {
                    sequence.push("U");
                    this.cubieCube.player(["U"]);
                }
                tempSequence.push(...[this.convertRotate(i % 4, false)]);
            }
            this.cubieCube.player(tempSequence);
            sequence.push(...tempSequence);
        }

        for (let i = 4; i < 8; i++) {
            //i == pos
            let tempSequence = [];
            let index = this.cubieCube.findEdge(i);
            let ori = this.cubieCube.cubieCube.edges[index].ori;

            if (index < 4) {
                if (index % 4 == (i + 1) % 4) {
                    tempSequence.push(...["U'"]);
                } else if (index % 4 == (i + 2) % 4) {
                    tempSequence.push(...["U", "U"]);
                } else if (index % 4 == (i + 3) % 4) {
                    tempSequence.push(...["U"]);
                }

                if (ori == 0) {
                    tempSequence.push(...[this.convertRotate(i % 4, true), this.convertRotate(i % 4, true)]);
                } else {
                    tempSequence.push(
                        ...[
                            this.convertRotate(i % 4, true),
                            "D",
                            "U'",
                            this.convertRotate((i + 3) % 4, false),
                            "D'",
                        ]
                    );
                }
            }

            this.cubieCube.player(tempSequence);
            sequence.push(...tempSequence);
        }

        return sequence;
    }

    firstLayer() {
        let sequence = [];

        for (let i = 4; i < 8; i++) {
            let tempSequence = [];
            let index = this.cubieCube.findCorner(i);
            let ori = this.cubieCube.cubieCube.corners[index].ori;

            if (index == i && ori == 0) {
                continue;
            }

            if (index > 3 && index % 4 != i % 4) {
                if (index % 4 == (i + 1) % 4) {
                    tempSequence.push(
                        ...[this.convertRotate(index % 4, false), "U'", this.convertRotate(index % 4, true)]
                    );
                } else if (index % 4 == (i + 2) % 4) {
                    tempSequence.push(
                        ...[
                            this.convertRotate(index % 4, false),
                            "U",
                            "U",
                            this.convertRotate(index % 4, true),
                        ]
                    );
                } else if (index % 4 == (i + 3) % 4) {
                    tempSequence.push(
                        ...[
                            this.convertRotate((index + 3) % 4, true),
                            "U",
                            this.convertRotate((index + 3) % 4, false),
                        ]
                    );
                }
            } else if (index == i) {
                tempSequence.push(
                    ...[
                        this.convertRotate((index + 3) % 4, true),
                        "U'",
                        this.convertRotate((index + 3) % 4, false),
                    ]
                );
            } else {
                if (index % 4 == (i + 1) % 4) {
                    tempSequence.push(...["U'"]);
                } else if (index % 4 == (i + 2) % 4) {
                    tempSequence.push(...["U", "U"]);
                } else if (index % 4 == (i + 3) % 4) {
                    tempSequence.push(...["U"]);
                }
            }

            this.cubieCube.player(tempSequence);
            sequence.push(...tempSequence);
            tempSequence = [];

            ori = this.cubieCube.cubieCube.corners[i % 4].ori;
            if (ori == 2) {
                tempSequence.push(
                    ...[
                        this.convertRotate((i + 3) % 4, true),
                        "U",
                        this.convertRotate((i + 3) % 4, false),
                        "U'",
                        this.convertRotate((i + 3) % 4, true),
                        "U",
                        this.convertRotate((i + 3) % 4, false),
                        "U'",
                    ]
                );
                ori = 0;
            }
            if (ori == 0) {
                tempSequence.push(
                    ...[
                        this.convertRotate((i + 3) % 4, true),
                        "U",
                        this.convertRotate((i + 3) % 4, false),
                        "U'",
                        this.convertRotate((i + 3) % 4, true),
                        "U",
                        this.convertRotate((i + 3) % 4, false),
                        "U'",
                    ]
                );
                ori = 1;
            }
            if (ori == 1) {
                tempSequence.push(
                    ...[this.convertRotate((i + 3) % 4, true), "U", this.convertRotate((i + 3) % 4, false)]
                );
            }

            this.cubieCube.player(tempSequence);
            sequence.push(...tempSequence);
        }

        return sequence;
    }

    secondLayer() {
        let sequence = [];

        for (let i = 8; i < 12; i++) {
            let tempSequence = [];
            let index = this.cubieCube.findEdge(i);
            let ori = this.cubieCube.cubieCube.edges[index].ori;

            if (i == index && ori == 0) {
                continue;
            }

            if (index > 7) {
                tempSequence.push(
                    ...[
                        this.convertRotate((index + 3) % 4, true),
                        "U'",
                        this.convertRotate((index + 3) % 4, false),
                        "U'",
                        this.convertRotate(index % 4, false),
                        "U",
                        this.convertRotate(index % 4, true),
                    ]
                );

                this.cubieCube.player(tempSequence);
                sequence.push(...tempSequence);
                tempSequence = [];
            }

            index = this.cubieCube.findEdge(i);
            ori = this.cubieCube.cubieCube.edges[index].ori;

            if ((i % 2 == 0 && ori == 0) || (i % 2 == 1 && ori == 1)) {
                if (index % 4 == i % 4) {
                    tempSequence.push(...["U", "U"]);
                } else if (index % 4 == (i + 1) % 4) {
                    tempSequence.push(...["U"]);
                } else if (index % 4 == (i + 3) % 4) {
                    tempSequence.push(...["U'"]);
                }

                tempSequence.push(
                    ...[
                        this.convertRotate(i % 4, false),
                        "U",
                        this.convertRotate(i % 4, true),
                        "U",
                        this.convertRotate((i + 3) % 4, true),
                        "U'",
                        this.convertRotate((i + 3) % 4, false),
                    ]
                );
            } else {
                if (index % 4 == i % 4) {
                    tempSequence.push(...["U"]);
                } else if (index % 4 == (i + 2) % 4) {
                    tempSequence.push(...["U'"]);
                } else if (index % 4 == (i + 3) % 4) {
                    tempSequence.push(...["U", "U"]);
                }

                tempSequence.push(
                    ...[
                        this.convertRotate((i + 3) % 4, true),
                        "U'",
                        this.convertRotate((i + 3) % 4, false),
                        "U'",
                        this.convertRotate(i % 4, false),
                        "U",
                        this.convertRotate(i % 4, true),
                    ]
                );
            }

            this.cubieCube.player(tempSequence);
            sequence.push(...tempSequence);
        }

        return sequence;
    }

    yellowCross() {
        let sequence = [];

        let count = 0;
        let first = -1;
        let distance = -1;
        for (let i = 0; i < 4; i++) {
            let ori = this.cubieCube.cubieCube.edges[i].ori;

            if (ori == 0) {
                count++;
                if (first < 0) {
                    first = i;
                } else {
                    distance = i - first;
                }
            }
        }

        if (count == 0) {
            sequence.push(
                ...[
                    this.convertRotate(0, true),
                    this.convertRotate(3, true),
                    "U",
                    this.convertRotate(3, false),
                    "U'",
                    this.convertRotate(3, true),
                    "U",
                    this.convertRotate(3, false),
                    "U'",
                    this.convertRotate(0, false),
                    "U",
                    this.convertRotate(0, true),
                    this.convertRotate(3, true),
                    "U",
                    this.convertRotate(3, false),
                    "U'",
                    this.convertRotate(0, false),
                ]
            );
        } else if (count == 2 && distance % 2 == 1) {
            if (first == 0 && distance == 1) {
                sequence.push(...["U"]);
            } else if (first == 2) {
                sequence.push(...["U'"]);
            } else if (first == 0 && distance == 3) {
                sequence.push(...["U", "U"]);
            }

            sequence.push(
                ...[
                    this.convertRotate(0, true),
                    this.convertRotate(3, true),
                    "U",
                    this.convertRotate(3, false),
                    "U'",
                    this.convertRotate(3, true),
                    "U",
                    this.convertRotate(3, false),
                    "U'",
                    this.convertRotate(0, false),
                ]
            );
        } else if (count == 2 && distance == 2) {
            if (first == 0) {
                sequence.push(...["U"]);
            }

            sequence.push(
                ...[
                    this.convertRotate(0, true),
                    this.convertRotate(3, true),
                    "U",
                    this.convertRotate(3, false),
                    "U'",
                    this.convertRotate(0, false),
                ]
            );
        }

        return sequence;
    }

    correctYellowCross() {
        let sequence = [];

        return sequence;
    }

    convertRotate(num, clockwiseDirection) {
        let move;
        if (num == 0) {
            move = "F";
        } else if (num == 1) {
            move = "L";
        } else if (num == 2) {
            move = "B";
        } else if (num == 3) {
            move = "R";
        }

        if (clockwiseDirection == false) {
            move += "'";
        }

        return move;
    }
}

export default ThreePhaseAlgorithm;
