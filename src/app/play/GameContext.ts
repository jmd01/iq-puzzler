import { createContext, useContext } from "react";

type GameContextProps = {
  cellSize: number;
  width: number;
  height: number;
  hasFx: boolean;
  toggleFx: () => void;
  levelId?: number;
  setLevelId: (levelId?: number) => void;
};

export const GameContext = createContext<GameContextProps>({
  cellSize: 0,
  width: 0,
  height: 0,
  hasFx: true,
  toggleFx: () => {},
  levelId: undefined,
  setLevelId: () => {},
});
export const useGameContext = () => useContext(GameContext);
