import { GameState, Piece, PlacedPiece, PreviewPiece } from "../types";

/**
 * Simple utility for deep copying an array.
 * NB: Only works for scalar values and objects (no functions, Symbols etc)
 */
export function nestedCopy<T>(array: T) {
  return JSON.parse(JSON.stringify(array)) as T;
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
 * Generate the initial grid based on the size of the board determined by the x and y parameters
 * Fill the array with zeros or ones to represent empty or filled cells. The grid is any array of rows (y) that contain an array of cells (x) eg a empty 2 column by 4 row grid would be represented as:
 * ```
 * [
 *  [0,0,0,0],
 *  [0,0,0,0],
 * ]
 * ```
 */
export function generateGameState(
  x: number,
  y: number,
  prePlacedPieces: PlacedPiece[]
): GameState {
  // Create an empty grid
  let grid: number[][] = Array(y).fill(Array(x).fill(0));

  // Fill it with the preplaced pieces
  prePlacedPieces &&
    prePlacedPieces.forEach(({ placedInCells }) => {
      grid = addPieceToBoard(grid, placedInCells);
    });

  return {
    grid,
    complete: false,
    moves: 0,
    startDate: new Date(),
  };
}

/**
 * Check if all the cells the piece will cover are empty
 */
export const getIsPiecePlaceable = (
  pieceOverCells: [number, number][],
  gameStateGrid: number[][]
): boolean =>
  pieceOverCells.every(([x, y]) => {
    return gameStateGrid[y] && gameStateGrid[y][x] === 0;
  });

/**
 * Get the cells on the board that a piece will cover if dropped on the board
 * in the format [[x,y],[x,y],[x,y]]
 */
export const getPieceOverCells = (
  boardCell: [number, number],
  shape: number[][]
): [number, number][] | undefined => {
  return shape.reduce<[number, number][] | undefined>((acc, currentRow, y) => {
    return currentRow.reduce<[number, number][] | undefined>(
      (rowAcc, coversCell, x) => {
        const cell: [number, number] = [boardCell[0] + x, boardCell[1] + y];
        return coversCell ? (rowAcc ? [...rowAcc, cell] : [cell]) : rowAcc;
      },
      acc
    );
  }, undefined);
};

export const getPlacedRotatedAndFlippedShape = (
  pieceShape: Piece["shape"],
  pieceRotation: Piece["rotation"],
  pieceIsFlippedX: Piece["isFlippedX"],
  pieceIsFlippedY: Piece["isFlippedY"]
) => {
  const rotatedShape = getPlacedRotatedShape(pieceShape, pieceRotation);
  const flippedShape = getFlippedShape(
    rotatedShape,
    pieceIsFlippedX,
    pieceIsFlippedY
  );
  return flippedShape;
};

/**
 *  Rotate a piece's shape array by Rotation degrees eg Rotate by 0.25 / 90 degrees
 * ```
 *  0 1 0
 *  1 1 1
 *  0 1 0
 *  0 1 0
 * ```
 * becomes
 * ```
 *  0 0 1 0
 *  1 1 1 1
 *  0 0 1 0
 * ```
 */
export function getRotatedShape(pieceShape: Piece["shape"]): Piece["shape"] {
  const pieceShapeClone = nestedCopy(pieceShape);
  return pieceShapeClone[0].map((_, index) =>
    pieceShapeClone.map((row) => row[index]).reverse()
  );
}

export function getPlacedRotatedShape(
  pieceShape: Piece["shape"],
  pieceRotation: Piece["rotation"]
): Piece["shape"] {
  const pieceShapeClone = nestedCopy(pieceShape);

  switch (getDecimalPart(pieceRotation)) {
    case 0:
      return pieceShapeClone;
    case 25:
      return pieceShapeClone[0].map((_, index) =>
        pieceShapeClone.map((row) => row[index]).reverse()
      );
    case 5:
      return [...pieceShapeClone.reverse()].map((row) => row.reverse());
    case 75:
      return pieceShapeClone[0].map((_, index) =>
        pieceShapeClone.map((row) => row[row.length - 1 - index])
      );
    default:
      return pieceShapeClone;
  }
}
/**
 *  Flip a piece's shape array by x or y axis, eg flip y axis
 * ```
 *  0 1 0
 *  1 1 1
 *  0 1 0
 *  0 1 0
 * ```
 * becomes
 * ```
 *  0 1 0
 *  0 1 0
 *  1 1 1
 *  0 1 0
 * ```
 *
 *
 */
export function getFlippedShape(
  pieceShape: Piece["shape"],
  pieceIsFlippedX: Piece["isFlippedX"],
  pieceIsFlippedY: Piece["isFlippedY"]
): Piece["shape"] {
  let flippedShape = nestedCopy(pieceShape);

  if (pieceIsFlippedX) {
    flippedShape = flippedShape.reverse();
  }
  if (pieceIsFlippedY) {
    flippedShape = flippedShape.map((row) => row.reverse());
  }

  return flippedShape;
}

export function getDecimalPart(num: number) {
  if (Number.isInteger(num)) {
    return 0;
  }

  const decimalStr = num.toString().split(".")[1];
  return Number(decimalStr);
}
