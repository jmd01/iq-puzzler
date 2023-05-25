"use client";

import { GameArea } from "./GameArea";
import { Piece } from "./Pieces";
import { useEffect, useState } from "react";

export default function Page() {
  const [activePiece, setActivePiece] = useState<Piece["id"]>();
  const [pieces, setPieces] = useState(generatePieces());

  // const sensors = useSensors(
  //   useSensor(MouseSensor, {
  //     activationConstraint: {
  //       distance: 10,
  //     },
  //   }),
  //   useSensor(TouchSensor, {
  //     activationConstraint: {
  //       delay: 250,
  //       tolerance: 5,
  //     },
  //   })
  // );

  // const handleDragStart = (event: DragStartEvent) => {
  //   const { active } = event;

  //   console.log("handleDragStart", event);
  //   setActivePiece(active.id);
  // };

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over, delta } = event;

  //   console.log("handleDragEnd", event);

  //   // if (over?.id === "board") {
  //   console.log(pieces.find(({ id }) => id === active.id));

  //   const updatedPieces = pieces.map((piece) =>
  //     piece.id === active.id
  //       ? {
  //           ...piece,
  //           position: {
  //             x: piece.position.x + delta.x,
  //             y: piece.position.y + delta.y,
  //           },
  //         }
  //       : piece
  //   );

  //   console.log(updatedPieces.find(({ id }) => id === active.id));

  //   setPieces(updatedPieces);
  //   // }
  // };

  // const handleDragOver = (event: DragEndEvent) => {
  //   const { active, over } = event;

  //   console.log("handleDragOver", event);

  //   if (over?.id === "board") {
  //     console.log("do dragover stuff");
  //   }
  // };

  return <GameArea pieces={pieces} setPieces={setPieces} />;
}

// const gridSize = 20;

// const snapToGridModifier: Modifier = (args) => {
//   const { transform } = args;

//   return {
//     ...transform,
//     x: Math.ceil(transform.x / gridSize) * gridSize,
//     y: Math.ceil(transform.y / gridSize) * gridSize,
//   };
// };

const generatePieces = (): Piece[] =>
  [...Array(10)].map((_, i) => ({
    id: i.toString(),
    isOverBoard: false,
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
  }));
