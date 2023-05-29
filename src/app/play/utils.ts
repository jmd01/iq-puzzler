import type { GameState, Piece, PreviewPiece, Rotation } from "./types";

export const CELL_SIZE = 64;
export const DRAG_OVER_BOARD_BUFFER = CELL_SIZE / 2;
export const DRAG_START_THRESHOLD = 5;

/**
 * On mousedown, determine whether the target is a piece or a cell on the board
 * TODO: this doesn't work if the pieces aren't placed but are overlapping due to stacking issues. Will need use an overlay for the rest of the game area and calc the xy of the pieces to determine if one was clicked
 */
export const getPieceIdOnMouseDown = (
  target: HTMLElement,
  pieces: Piece[]
): Piece["id"] | undefined => {
  if (target.id.includes("piece")) {
    return target.id.split("-")?.[1];
  }

  const cellData = target.getAttribute("data-board-cell")?.split(",");

  const cell: [number, number] | undefined =
    cellData && cellData.length === 2
      ? [parseInt(cellData[0]), parseInt(cellData[1])]
      : undefined;

  if (cell) {
    return getPlacedPieceIdFromCell(cell, pieces);
  }
};

/**
 * When clicking a cell on the board, if a piece is placed there, get its ID
 */
const getPlacedPieceIdFromCell = (
  clickedCell: [number, number],
  pieces: Piece[]
): Piece["id"] | undefined => {
  return pieces.find((piece) => {
    return piece.placedInCells?.some(
      (cell) => cell[0] === clickedCell[0] && cell[1] === clickedCell[1]
    );
  })?.id;
};

/**
 * When dragging a piece, determine whether it is over the board.
 * The buffer allows a piece to be considered over the board even if piece is not fully over the board
 */
export function isActivePieceOverBoard(
  pieceBounds: DOMRect,
  boardBounds: DOMRect
) {
  return (
    pieceBounds.top > boardBounds.top - DRAG_OVER_BOARD_BUFFER &&
    pieceBounds.left > boardBounds.top - DRAG_OVER_BOARD_BUFFER &&
    pieceBounds.bottom < boardBounds.bottom + DRAG_OVER_BOARD_BUFFER &&
    pieceBounds.right < boardBounds.right + DRAG_OVER_BOARD_BUFFER
  );
}

function calcRotatedInitialPiecePosition(
  pieceBounds: DOMRect,
  pieceRotation: Piece["rotation"],
  pieceInitialPosition: Piece["initialPosition"]
): Piece["initialPosition"] {
  const isRotatedSideways = pieceRotation === 0.25 || pieceRotation === 0.75;

  if (isRotatedSideways) {
    // const pieceBoundsRatio = pieceBounds.height / pieceBounds.width;

    const offset = (pieceBounds.height - pieceBounds.width) / 2;
    // const widthOffset = pieceBounds.width * pieceBoundsRatio;

    // const offsetInitialPositionByRotation = {
    //   x: pieceInitialPosition.x + offset,
    //   y: pieceInitialPosition.y - offset,
    // };
    // console.log({
    //   pieceInitialPosition,
    //   offset,
    //   offsetInitialPositionByRotation,
    // });

    const offsetInitialPositionByRotation =
      pieceBounds.height > pieceBounds.width
        ? {
            x: pieceInitialPosition.x - offset,
            y: pieceInitialPosition.y + offset,
          }
        : {
            x: pieceInitialPosition.x + offset,
            y: pieceInitialPosition.y - offset,
          };

    return offsetInitialPositionByRotation;
  }

  return pieceInitialPosition;
}

//
function getRotatedShape(
  pieceShape: Piece["shape"],
  pieceRotation: Piece["rotation"]
): Piece["shape"] {
  switch (pieceRotation) {
    case 0:
      return pieceShape;
    case 0.25:
      return pieceShape[0].map((_, index) =>
        pieceShape.map((row) => row[index]).reverse()
      );
    case 0.5:
      return [...pieceShape.reverse()];
    case 0.75:
      return pieceShape[0].map((_, index) =>
        pieceShape.map((row) => row[row.length - 1 - index])
      );
  }
}

/**
 * When dragging a piece, calculate the cells on the board that a piece will cover if dropped on the board
 * Also returns the index of top and left cells that the piece will be dropped on
 */
export function boardsCellsCoveredByPiece(
  pieceBounds: DOMRect,
  boardBounds: DOMRect,
  pieceShape: Piece["shape"],
  pieceRotation: Piece["rotation"],
  gameStateGrid: GameState["grid"]
): PreviewPiece | undefined {
  const pieceTopRelativeToBoard = Math.max(
    pieceBounds.top - boardBounds.top,
    0
  );
  const pieceLeftRelativeToBoard = Math.max(
    pieceBounds.left - boardBounds.left,
    0
  );

  // The board cell nearest the top side that the dragged piece is over
  const pieceOverBoardCellY = Math.round(pieceTopRelativeToBoard / CELL_SIZE);
  // The board cell nearest the left side that the dragged piece is over
  const pieceOverBoardCellX = Math.round(pieceLeftRelativeToBoard / CELL_SIZE);

  // The index of boards cells that the dragged piece is over  
  const pieceOverCells = getRotatedShape(pieceShape, pieceRotation).reduce<
    [number, number][] | undefined
  >((acc, currentRow, y) => {
    return currentRow.reduce<[number, number][] | undefined>(
      (rowAcc, coversCell, x) => {
        const cell: [number, number] = [
          pieceOverBoardCellX + x,
          pieceOverBoardCellY + y,
        ];
        return coversCell ? (rowAcc ? [...rowAcc, cell] : [cell]) : rowAcc;
      },
      acc
    );
  }, undefined);

  console.log("here");
  

  if (pieceOverCells) {
    // Check all the cells the piece will cover are empty
    const isPiecePlaceable = pieceOverCells.every(([x, y]) => {
      return gameStateGrid[y] && gameStateGrid[y][x] === 0;
    });

    if (isPiecePlaceable) {
      return {
        x: pieceOverBoardCellX,
        y: pieceOverBoardCellY,
        cells: pieceOverCells,
      };
    }
  }
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
  pieceBounds: DOMRect,
  boardBounds: DOMRect,
  previewPiece: PreviewPiece
) {
  const pieceInitialPosition = calcRotatedInitialPiecePosition(
    pieceBounds,
    piece.rotation,
    piece.initialPosition
  );
  console.log({ piece, pieceInitialPosition });

  return {
    x: boardBounds.left + previewPiece.x * CELL_SIZE - pieceInitialPosition.x,
    y: boardBounds.top + previewPiece.y * CELL_SIZE - pieceInitialPosition.y,
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

/**
 * Rotate the piece with id by 90 degrees and update pieces array
 */
export function updatePiecesWithRotatedPiece(
  pieces: Piece[],
  id: Piece["id"]
): Piece[] {
  return pieces.map((piece) =>
    piece.id === id
      ? {
          ...piece,
          rotation:
            piece.rotation === 0.75 ? 0 : ((piece.rotation + 0.25) as Rotation),
        }
      : piece
  );
}
