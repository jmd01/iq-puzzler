"use client";
import { Board } from "../../components/Board";
import Logo from "../../components/Logo";
import {
  useRef,
  useState,
  useEffect,
} from "react";
import type { Piece, PlacedPiece } from "../../types";
import { AnimatedBackground } from "../../components/AnimatedBackground";
import gameAreaStyles from "../../styles/gameArea.module.css";
import * as twStyles from "../../styles/styles";

type GameAreaProps = {
  placedPieces: PlacedPiece[];
  unplacedPieces: Piece[];
};
export const GameArea = ({ placedPieces }: GameAreaProps) => {
  const [prePlacedPieces] = useState(placedPieces);

  const [gameAreaDims, setGameAreaDims] = useState<{
    width: number | string;
    height: number | string;
  }>({
    height: "100%",
    width: "100%",
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Fix the window size to 100% on first load
  useEffect(() => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current?.getBoundingClientRect();
      setGameAreaDims({
        width,
        height,
      });
    }
  }, []);

  return (
    <div
      ref={gameAreaRef}
      className={gameAreaStyles.gameArea}
      style={{
        width: gameAreaDims.width,
        height: gameAreaDims.height,
      }}
    >
      <AnimatedBackground />
      <div className={twStyles.logoContainer}>
        <Logo fill="#3a287a" width={80} />
      </div>
      <Board
        boardRef={boardRef}
        previewPiece={undefined}
        prePlacedPieces={prePlacedPieces}
      />
    </div>
  );
};
