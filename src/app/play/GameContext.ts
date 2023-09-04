import { createContext, useContext } from "react";

export const GameContext = createContext<{
  cellSize: number;
  width: number;
  height: number;
}>({ cellSize: 0, width: 0, height: 0 });
export const useGameContext = () => useContext(GameContext);
