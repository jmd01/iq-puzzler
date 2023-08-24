import { createContext, useContext } from "react";

export const GameContext = createContext<{ cellSize: number }>({ cellSize: 0 });
export const useGameContext = () => useContext(GameContext);