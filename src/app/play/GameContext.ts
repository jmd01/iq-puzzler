import { createContext, useContext } from "react";

export const GameContext = createContext<{
  cellSize: number;
  width: number;
  height: number;
  hasFx: boolean;
  toggleFx: () => void;
}>({ cellSize: 0, width: 0, height: 0, hasFx: true, toggleFx: () => {} });
export const useGameContext = () => useContext(GameContext);
