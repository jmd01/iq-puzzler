import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { generateGameState } from "../../../utils/sharedUtils";
import type { LevelLocalStorage } from "../../hooks/useLocalStorage";
import type { GameState, PlacedPiece } from "../../../types";

export const useGameState = (
  level: number,
  placedPieces: PlacedPiece[],
  initialLocalStorageData?: LevelLocalStorage
): [GameState, (gameState: GameState) => void] => {
  const [gameState, setGameState] = useState<GameState>(
    generateGameState(11, 5, placedPieces, initialLocalStorageData)
  );

  const { setLocalStorageGameState } = useLocalStorage(level);

  const setGameStateAndLocalStorage = (gameState: GameState) => {
    setLocalStorageGameState(gameState);
    setGameState(gameState);
  };

  return [gameState, setGameStateAndLocalStorage];
};
