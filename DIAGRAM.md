# RubikCube — Class Diagram

```mermaid
classDiagram
    direction LR

    class RubikCubeScene {
        -container
        -scene
        -camera
        -renderer
        -sceneController : SceneController
        -cubeController : RubikCubeController
        -rubikCube : RubikCube
        -cubieCube : CubieCube
        +init(container)
        +loadCube()
        +loadMaterials()
        +addLights()
        +onMouseDown(e)
        +onMouseMove(e)
        +onMouseUp()
        +handleKeyDown(e)
        +handleKeyUp(e)
        +render()
        +rotateSide(axis, layer, cw)
        +scramble()
        +setBrushColor(c)
        +setFaceColor(id, hex)
        +applyPalette(p)
        +convertFrom3DCube()
        +solveCube(algorithmName)
        +changeMode(mode)
        +setRotationSpeed(s)
    }

    class SceneController {
        -orbitControls
        +update()
        +dispose()
    }

    class RubikCubeController {
        -scene
        -centralCubeElement
        -cubies
        -stickers
        -rotationSpeed
        +scramble()
        +getRandomInt(min, max)
        +setRotationSpeed(s)
        +player(sequence)
        +rotateSide(axis, layer, cw)
        +findCubeSideElements(axis, layer)
    }

    class RubikCube {
        -faces
        -colorMap
        +convertFrom3DCube(stickers)
        +getDominantDirection(v)
        +getCubeSideCoordinates(v, side)
    }

    class CubieCube {
        +cubieCube : {corners, edges}
        -cornerCoords
        -edgeCoords
        -cornerColorTable
        -edgeColorTable
        -colorMap
        +convertFrom3DCube(cubies)
        +convertTo3DCube(cubies)
        +findCoords(pos, coords)
        +findPos(stickers, table)
        +findOri(stickers, table, pos, idx)
        +getDominantDirection(v)
        +findCorner(pos)
        +findEdge(pos)
        +player(sequence)
        +rotateSide(move)
    }

    class CubeValidator {
        +validate(cubieCube)$
    }

    class ThreePhaseAlgorithm {
        #cubieCube : CubieCube
        +solveCube() string[]
        +whiteCross() string[]
        +firstLayer() string[]
        +firstLayerForSlot(i) string[]
        +secondLayer() string[]
        +secondLayerForSlot(i) string[]
        +yellowCross() string[]
        +correctYellowCross() string[]
        +thirdLayerCornersPosition() string[]
        +thirdLayerCornersRotation() string[]
        +convertRotate(num, cw) string
    }

    class FridrichAlgorithm {
        +solveCube() string[]
        +solveCross() string[]
        +solveF2L() string[]
        +solveF2LSlot(c, e) string[]
        +solveOLL() string[]
        +solvePLL() string[]
        -_ollOrientCorners() string[]
        -_pllCorners() string[]
        -_pllEdges() string[]
        -_finalAUF() string[]
        -_snapshot()
        -_restore(snap)
        -_apply(seq, moves)
    }

    class RubikCubeCanvas {
        <<React component>>
        +useEffect()
        +render()
    }

    FridrichAlgorithm --|> ThreePhaseAlgorithm : extends
    ThreePhaseAlgorithm o-- CubieCube : uses

    RubikCubeScene *-- SceneController
    RubikCubeScene *-- RubikCubeController
    RubikCubeScene *-- RubikCube
    RubikCubeScene *-- CubieCube
    RubikCubeScene ..> ThreePhaseAlgorithm : instantiates
    RubikCubeScene ..> FridrichAlgorithm : instantiates
    RubikCubeScene ..> CubeValidator : uses

    CubeValidator ..> CubieCube : reads

    RubikCubeCanvas ..> RubikCubeScene : mounts

    note for FridrichAlgorithm "CFOP pipeline:\nCross → F2L → OLL → PLL\noverrides solveCross with\nfull state machine"
    note for ThreePhaseAlgorithm "Layer-by-layer base.\nProvides shared primitives\nreused by Fridrich F2L/OLL/PLL."
    note for CubieCube "edges[i] / corners[i] = slot i\n.pos = piece-id currently here\n.ori = orientation"
```

## Legend

- `--|>` inheritance
- `*--` composition (owns lifecycle)
- `o--` aggregation (uses, doesn't own)
- `..>` dependency (instantiates / calls)
- `$` static method
- `#` protected, `-` private, `+` public
