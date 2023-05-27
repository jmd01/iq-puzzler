import type { Piece } from "./types";

export const cellSize = 64;

export function isActivePieceOverBoard(
  pieceBounds: DOMRect,
  boardBounds: DOMRect,
  buffer: number
) {
  return (
    pieceBounds.top > boardBounds.top - buffer &&
    pieceBounds.left > boardBounds.top - buffer &&
    pieceBounds.bottom < boardBounds.bottom + buffer &&
    pieceBounds.right < boardBounds.right + buffer
  );
}

export const boardsCellsCoveredByPiece = (
  pieceBounds: DOMRect,
  boardBounds: DOMRect,
  pieceShape: Piece["shape"]
) => {
  const pieceTopRelativeToBoard = Math.max(
    pieceBounds.top - boardBounds.top,
    0
  );

  const pieceLeftRelativeToBoard = Math.max(
    pieceBounds.left - boardBounds.left,
    0
  );

  const pieceOverCellY = Math.round(pieceTopRelativeToBoard / cellSize);

  const pieceOverCellX = Math.round(pieceLeftRelativeToBoard / cellSize);

  const pieceOverCells = pieceShape.reduce<[number, number][] | undefined>(
    (acc, currentRow, y) => {
      return currentRow.reduce<[number, number][] | undefined>(
        (acc2, coversCell, x) => {
          const cell: [number, number] = [
            pieceOverCellX + x,
            pieceOverCellY + y,
          ];
          return coversCell ? (acc2 ? [...acc2, cell] : [cell]) : acc2;
        },
        acc
      );
    },
    undefined
  );

  // console.log({ pieceOverCells });
  return pieceOverCells
    ? { x: pieceOverCellX, y: pieceOverCellY, cells: pieceOverCells }
    : undefined;
};

export function isPlaceable() {}


export function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}