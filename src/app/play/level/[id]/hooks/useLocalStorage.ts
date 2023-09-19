import { GameState, Piece } from "../../types";

export type LocalStoragePiece = Pick<
  Piece,
  | "id"
  | "rotation"
  | "isFlippedX"
  | "isFlippedY"
  | "placedInCells"
  | "currentShape"
>;
export type LevelLocalStorage = GameState & {
  level: number;
  placedPieces?: LocalStoragePiece[];
};

export const useLocalStorage = (levelId: number) => {
  const localStorageKey = `level-${levelId}`;

  const getLocalStorage = (): LevelLocalStorage | undefined => {
    const localStorage = window.localStorage.getItem(localStorageKey);
    if (localStorage) {
      try {
        const parsedLocalStorage = JSON.parse(localStorage);
        const startDate =
          "startDate" in parsedLocalStorage
            ? new Date(parsedLocalStorage.startDate)
            : undefined;

        return {
          ...parsedLocalStorage,
          startDate,
        };
      } catch (e) {
        console.error(e);
      }
    }
  };

  const setLocalStorage = (localStorage: LevelLocalStorage) => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(localStorage));
  };
  const setLocalStorageGameState = (gameState: GameState) => {
    const localStorage = getLocalStorage();
    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify({ ...localStorage, ...gameState })
    );
  };
  const setLocalStoragePlacedPieces = (pieces: Piece[]) => {
    const localStorage = getLocalStorage();
    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        ...localStorage,
        placedPieces: pieces
          .filter((p) => p.placedInCells && p.placedInCells.length > 0)
          .map((p) => ({
            id: p.id,
            rotation: p.rotation,
            isFlippedX: p.isFlippedX,
            isFlippedY: p.isFlippedY,
            placedInCells: p.placedInCells,
            currentShape: p.currentShape,
          })),
      })
    );
  };
  const setLocalStorageLastLevel = (level: number) => {
    window.localStorage.setItem("lastLevel", level.toString());
  };
  const getLocalStorageLastLevel = () => {
    return Number(window.localStorage.getItem("lastLevel"));
  };

  const clearLocalStorage = () => {
    window.localStorage.removeItem(localStorageKey);
  };

  return {
    getLocalStorage,
    setLocalStorage,
    setLocalStorageGameState,
    setLocalStoragePlacedPieces,
    setLocalStorageLastLevel,
    getLocalStorageLastLevel,
    clearLocalStorage,
  };
};
