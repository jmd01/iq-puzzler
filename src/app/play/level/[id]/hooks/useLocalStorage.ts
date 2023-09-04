import { GameState, Piece } from "../../types";

export type LocalStoragePiece = Pick<
  Piece,
  "id" | "rotation" | "isFlippedX" | "isFlippedY" | "placedInCells"
>;
export type LevelLocalStorage = GameState & {
  level: number;
  placedPieces?: LocalStoragePiece[];
};

export const useLocalStorage = (levelId: number) => {
  const localStorageKey = `level-${levelId}`;
  const getLocalStorage = (): LevelLocalStorage | undefined => {
    const localStorage = window.localStorage.getItem(localStorageKey);
    return localStorage ? JSON.parse(localStorage) : undefined;
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
          })),
      })
    );
  };
  // const setLocalStoragePlacedPieces = (piece: LocalStoragePiece) => {
  //   const localStorage = getLocalStorage();
  //   window.localStorage.setItem(
  //     localStorageKey,
  //     JSON.stringify({
  //       ...localStorage,
  //       placedPieces: localStorage?.placedPieces?.some((p) => p.id === piece.id)
  //         ? localStorage?.placedPieces?.map((p) =>
  //             p.id === piece.id ? piece : p
  //           )
  //         : [...(localStorage?.placedPieces || []), piece],
  //     })
  //   );
  // };

  const clearLocalStorage = () => {
    window.localStorage.removeItem(localStorageKey);
  };

  return {
    getLocalStorage,
    setLocalStorage,
    setLocalStorageGameState,
    setLocalStoragePlacedPieces,
    clearLocalStorage,
  };
};
