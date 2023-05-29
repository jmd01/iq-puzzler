"use client";

import { GameArea } from "./GameArea";
import { Piece } from "./types";
import { useState } from "react";

export default function Page() {
  const [pieces, setPieces] = useState(generatePieces());

  return <GameArea pieces={pieces} setPieces={setPieces} />;
}

const generatePieces = (): Piece[] =>
  [...Array(10)].map((_, i) => ({
    id: i.toString(),
    initialPosition: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    rotation: 0,
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    size: [3, 4],
    isActivePiece: false,
    ref: { current: null },
  }));

// // rotated shape
// const shape = [
//   [0, 0, 1, 0],
//   [1, 1, 1, 1],
//   [0, 0, 1, 0],
// ];

//

