"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pieceOrientations = void 0;
const getPieceOrientations = (isFlippedX) => [
    {
        rotation: 0,
        isFlippedX: false,
        isFlippedY: false,
    },
    {
        rotation: 0.25,
        isFlippedX: false,
        isFlippedY: false,
    },
    {
        rotation: 0.5,
        isFlippedX: false,
        isFlippedY: false,
    },
    {
        rotation: 0.75,
        isFlippedX: false,
        isFlippedY: false,
    },
];
exports.pieceOrientations = {
    1: [...getPieceOrientations(), ...getPieceOrientations(true)],
    2: getPieceOrientations(),
    3: getPieceOrientations(),
    4: [...getPieceOrientations(), ...getPieceOrientations(true)],
    5: getPieceOrientations(),
    6: [...getPieceOrientations(), ...getPieceOrientations(true)],
    7: [...getPieceOrientations(), ...getPieceOrientations(true)],
    8: [...getPieceOrientations(), ...getPieceOrientations(true)],
    9: getPieceOrientations(),
    10: [...getPieceOrientations(), ...getPieceOrientations(true)],
    11: [...getPieceOrientations(), ...getPieceOrientations(true)],
    12: getPieceOrientations(),
};
//# sourceMappingURL=pieceOrientations.js.map