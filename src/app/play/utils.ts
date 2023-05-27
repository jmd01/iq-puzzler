import type { GameState, Piece, PreviewPiece } from "./types";

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
): PreviewPiece | undefined => {
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
        (rowAcc, coversCell, x) => {
          const cell: [number, number] = [
            pieceOverCellX + x,
            pieceOverCellY + y,
          ];
          return coversCell ? (rowAcc ? [...rowAcc, cell] : [cell]) : rowAcc;
        },
        acc
      );
    },
    undefined
  );

  return pieceOverCells
    ? { x: pieceOverCellX, y: pieceOverCellY, cells: pieceOverCells }
    : undefined;
};

export const generateGameState = (x: number, y: number): GameState => ({
  grid: Array(y).fill(Array(x).fill(0)),
  complete: false,
});

export function addPieceToBoard(
  gameStateGrid: GameState["grid"],
  previewPieceCell: PreviewPiece["cells"]
): GameState["grid"] {
  const updatedGrid = nestedCopy(gameStateGrid);
  previewPieceCell.forEach(([x, y]) => {
    if (updatedGrid[y][x] === 1) {
      throw Error(
        `Trying to place piece on {x:${x}, y:${y}} but cell is already taken.`
      );
    }
    updatedGrid[y][x] = 1;
  });
  return updatedGrid;
}

export function removePieceFromBoard(
  gameStateGrid: GameState["grid"],
  placedPieceCells: NonNullable<Piece["placedInCells"]>
) {
  const updatedGrid = nestedCopy(gameStateGrid);
  placedPieceCells.forEach(([x, y]) => {
    if (updatedGrid[y][x] === 0) {
      throw Error(
        `Trying to remove piece from {x:${x}, y:${y}} but cell is not taken.`
      );
    }
    updatedGrid[y][x] = 0;
  });
  return updatedGrid;
}

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

function nestedCopy<T>(array: T) {
  return JSON.parse(JSON.stringify(array)) as T;
}
