import type { GameState, Piece, PreviewPiece } from "./types";

export const cellSize = 64;

/**
 * When dragging a piece, determine whether it is over the board.
 * The buffer allows a piece to be considered over the board even if piece is not fully over the board
 */
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

/**
 * When dragging a piece, calculate the cells on the board that a piece will cover if dropped on the board
 * Also returns the index of top and left cells that the piece will be dropped on
 */
export function boardsCellsCoveredByPiece(
  pieceBounds: DOMRect,
  boardBounds: DOMRect,
  pieceShape: Piece["shape"]
): PreviewPiece | undefined {
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
}

/**
 * Generate the initial grid based on the size of the board determined by the x and y parameters
 * Fill the array with zeros or ones to represent empty or filled cells. The grid is any array of rows (y) that contain an array of cells (x) eg a empty 2 column by 4 row grid would be represented as:
 * ```
 * [
 *  [0,0,0,0],
 *  [0,0,0,0],
 * ]
 * ```
 */
export function generateGameState(x: number, y: number): GameState {
  return {
    grid: Array(y).fill(Array(x).fill(0)),
    complete: false,
  };
}

/**
 * On drag end, if the active piece is over the board and placeable, there will be a preview piece. This function will add the preview piece to the board
 */
export function addPieceToBoard(
  gameStateGrid: GameState["grid"],
  previewPieceCell: PreviewPiece["cells"]
): GameState["grid"] {
  const updatedGrid = nestedCopy(gameStateGrid);
  previewPieceCell.forEach(([x, y]) => {
    if (updatedGrid[y][x] === 1) {
      console.error(
        `Trying to place piece on board at {x:${x}, y:${y}} but cell is already taken.`
      );
    }
    updatedGrid[y][x] = 1;
  });
  return updatedGrid;
}

/**
 * On drag start, if the active piece is currently placed on the board, remove it
 */
export function removePieceFromBoard(
  gameStateGrid: GameState["grid"],
  placedPieceCells: NonNullable<Piece["placedInCells"]>
) {
  const updatedGrid = nestedCopy(gameStateGrid);
  placedPieceCells.forEach(([x, y]) => {
    if (updatedGrid[y][x] === 0) {
      console.error(
        `Trying to remove piece from board at {x:${x}, y:${y}} but cell is not taken.`
      );
    }
    updatedGrid[y][x] = 0;
  });
  return updatedGrid;
}

/**
 * Utility for merging refs eg where 2 or more separate refs need to be passed to a single element
 */
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

/**
 * Simple utility for deep copying an array.
 * NB: Only works for scalar values and objects (no functions, Symbols etc)
 */
export function nestedCopy<T>(array: T) {
  return JSON.parse(JSON.stringify(array)) as T;
}

/**
 * On drag end, if the piece is placeable, calculate it's transform to display it in the correct place on the board.
 * Calculated as the position of the preview piece relative the starting position of the piece to place
 */
export function calcPlacedPosition(
  piece: Piece,
  boardBounds: DOMRect,
  previewPiece: PreviewPiece
) {
  return {
    x: boardBounds.left + previewPiece.x * cellSize - piece.initialPosition.x,
    y: boardBounds.top + previewPiece.y * cellSize - piece.initialPosition.y,
  };
}

/**
 * On drag end, if the piece is not placeable, calculate it's transform to display it whereever it is currently dragged to.
 */
export function calcUnplacedPosition(
  piece: Piece,
  dragPosition: { x: number; y: number } | undefined,
  onMouseDownPosition: { x: number; y: number } | undefined
) {
  return {
    x:
      (dragPosition?.x ?? 0) - (onMouseDownPosition?.x ?? 0) + piece.position.x,
    y:
      (dragPosition?.y ?? 0) - (onMouseDownPosition?.y ?? 0) + piece.position.y,
  };
}
