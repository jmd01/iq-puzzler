import { Piece, SolutionPiece } from "@prisma/client";

const getPieceOrientations = (isFlippedX = false) => [
  {
    rotation: 0,
    isFlippedX: isFlippedX,
    isFlippedY: false,
  },
  {
    rotation: 0.25,
    isFlippedX: isFlippedX,
    isFlippedY: false,
  },
  {
    rotation: 0.5,
    isFlippedX: isFlippedX,
    isFlippedY: false,
  },
  {
    rotation: 0.75,
    isFlippedX: isFlippedX,
    isFlippedY: false,
  },
];

export const pieceOrientations: Record<
  Piece["id"],
  Pick<SolutionPiece, "rotation" | "isFlippedX" | "isFlippedY">[]
> = {
  1: [...getPieceOrientations(), ...getPieceOrientations(true)],
  2: getPieceOrientations(),
  3: getPieceOrientations(),
  4: [...getPieceOrientations(), ...getPieceOrientations(true)],
  5: [
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
      rotation: 0,
      isFlippedX: true,
      isFlippedY: false,
    },
    {
      rotation: 0.25,
      isFlippedX: true,
      isFlippedY: false,
    },
  ],
  6: [...getPieceOrientations(), ...getPieceOrientations(true)],
  7: getPieceOrientations(),
  8: [...getPieceOrientations(), ...getPieceOrientations(true)],
  9: getPieceOrientations(),
  10: [...getPieceOrientations(), ...getPieceOrientations(true)],
  11: [...getPieceOrientations(), ...getPieceOrientations(true)],
  12: getPieceOrientations(),
};
