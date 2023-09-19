"use client";
import { Board } from "../../level/components/Board";
import { useRef, useState } from "react";
import type { PlacedPiece } from "../../level/types";

type GameAreaProps = {
  placedPieces: PlacedPiece[];
};
export const GameArea = ({ placedPieces }: GameAreaProps) => {
  const [prePlacedPieces] = useState(placedPieces);

  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <Board
        boardRef={boardRef}
        previewPiece={undefined}
        prePlacedPieces={prePlacedPieces}
        setBoardAnimationComplete={() => {}}
      />
    </div>
  );
};
