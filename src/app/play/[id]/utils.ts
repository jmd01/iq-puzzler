import { getRotatedAndFlippedShape } from "./sharedUtils";
import { boardCell } from "./styles";
import type {
  GameState,
  Piece,
  PlacedPiece,
  PreviewPiece,
  Rotation,
} from "./types";

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
  if (target.className.includes("piece")) {
    const pieceId = target.className.split("-")?.[1];
    return pieces.find(
      (piece) => piece.id === Number(pieceId) && !piece.isLocked
    )?.id;
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
    return (
      !piece.isLocked &&
      piece.placedInCells?.some(
        (cell) => cell[0] === clickedCell[0] && cell[1] === clickedCell[1]
      )
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

/**
 * When a piece is rotated, if it is not a square shape then it's position will change relative to the screen.
 * This function calculates the new position of the piece so that it can be positioned relative to the board and it's initial position when placed
 */
function calcRotatedInitialPiecePosition(
  pieceBounds: { width: number; height: number },
  pieceRotation: Piece["rotation"],
  pieceInitialPosition: Piece["initialPosition"]
): Piece["initialPosition"] {
  const isRotatedSideways =
    getDecimalPart(pieceRotation) === 25 ||
    getDecimalPart(pieceRotation) === 75;

  if (isRotatedSideways) {
    const offsetX = (pieceBounds.height - pieceBounds.width) / 2;
    const offsetY = (pieceBounds.width - pieceBounds.height) / 2;

    const offsetInitialPositionByRotation =
      pieceBounds.height > pieceBounds.width
        ? {
            x: pieceInitialPosition.x + offsetX,
            y: pieceInitialPosition.y + offsetY,
          }
        : {
            x: pieceInitialPosition.x - offsetX,
            y: pieceInitialPosition.y - offsetY,
          };

    return offsetInitialPositionByRotation;
  }

  return pieceInitialPosition;
}

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
 *
 *
 */
// export function getRotatedShape(
//   pieceShape: Piece["shape"],
//   pieceRotation: Piece["rotation"]
// ): Piece["shape"] {
//   const pieceShapeClone = nestedCopy(pieceShape);
//   switch (getDecimalPart(pieceRotation)) {
//     case 0:
//       return pieceShapeClone;
//     case 25:
//       return pieceShapeClone[0].map((_, index) =>
//         pieceShapeClone.map((row) => row[index]).reverse()
//       );
//     case 5:
//       return [...pieceShapeClone.reverse()].map((row) => row.reverse());
//     case 75:
//       return pieceShapeClone[0].map((_, index) =>
//         pieceShapeClone.map((row) => row[row.length - 1 - index])
//       );
//     default:
//       return pieceShapeClone;
//   }
// }
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
// export function getFlippedShape(
//   pieceShape: Piece["shape"],
//   pieceIsFlippedX: Piece["isFlippedX"],
//   pieceIsFlippedY: Piece["isFlippedY"]
// ): Piece["shape"] {
//   let flippedShape = nestedCopy(pieceShape);

//   if (pieceIsFlippedX) {
//     flippedShape = flippedShape.reverse();
//   }
//   if (pieceIsFlippedY) {
//     flippedShape = flippedShape.map((row) => row.reverse());
//   }

//   return flippedShape;
// }

/**
 * When dragging a piece, calculate the cells on the board that a piece will cover if dropped on the board
 * Also returns the index of top and left cells that the piece will be dropped on
 */
export function boardsCellsCoveredByPiece(
  pieceBounds: DOMRect,
  boardBounds: DOMRect,
  pieceShape: Piece["shape"],
  pieceRotation: Piece["rotation"],
  pieceIsFlippedX: Piece["isFlippedX"],
  pieceIsFlippedY: Piece["isFlippedY"],
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

  const flippedShape = getRotatedAndFlippedShape(
    pieceShape,
    pieceRotation,
    pieceIsFlippedX,
    pieceIsFlippedY
  );

  // The index of boards cells that the dragged piece is over
  const pieceOverCells = getPieceOverCells(
    [pieceOverBoardCellX, pieceOverBoardCellY],
    flippedShape
  );

  if (pieceOverCells) {
    // Check all the cells the piece will cover are empty
    const isPiecePlaceable = getIsPiecePlaceable(pieceOverCells, gameStateGrid);

    if (isPiecePlaceable) {
      return {
        x: pieceOverBoardCellX,
        y: pieceOverBoardCellY,
        cells: pieceOverCells,
      };
    }
  }
}

// export const getRotatedAndFlippedShape = (
//   pieceShape: Piece["shape"],
//   pieceRotation: Piece["rotation"],
//   pieceIsFlippedX: Piece["isFlippedX"],
//   pieceIsFlippedY: Piece["isFlippedY"]
// ) => {
//   const rotatedShape = getRotatedShape(pieceShape, pieceRotation);
//   return getFlippedShape(rotatedShape, pieceIsFlippedX, pieceIsFlippedY);
// };

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
  piece: {
    rotation: Piece["rotation"];
    initialPosition: Piece["initialPosition"];
  },
  pieceBounds: { width: number; height: number },
  boardBounds: { top: number; left: number },
  previewPiece: { x: number; y: number },
  isPreplaced?: boolean
) {
  const pieceInitialPosition = calcRotatedInitialPiecePosition(
    pieceBounds,
    piece.rotation,
    piece.initialPosition
  );

  const onloadAnimationOffset = isPreplaced ? 0 : 20;

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
  id: Piece["id"],
  droppedOnBoard: boolean
): Piece[] {
  return pieces.map((piece) => {
    if (piece.id === id) {
      return {
        ...piece,
        rotation: rotatePiece(
          piece.rotation,
          (piece.isFlippedX && piece.isFlippedY) ||
            (!piece.isFlippedX && !piece.isFlippedY)
            ? "clockwise"
            : "anticlockwise"
        ),
        droppedOnBoard,
        isActivePiece: false,
        onMouseDownPosition: undefined,
        dragPosition: undefined,
        placedInCells: undefined,
      };
    } else {
      return piece;
    }
  });
}

/**
 * Flip the piece on x or y axis and update pieces array
 */
export function updatePiecesWithFlippedPiece(
  pieces: Piece[],
  id: Piece["id"],
  droppedOnBoard: boolean,
  plane: "x" | "y"
): Piece[] {
  return pieces.map((piece) =>
    piece.id === id
      ? {
          ...piece,
          isFlippedX: plane === "x" ? !piece.isFlippedX : piece.isFlippedX,
          isFlippedY: plane === "y" ? !piece.isFlippedY : piece.isFlippedY,
          droppedOnBoard,
          isActivePiece: false,
          onMouseDownPosition: undefined,
          dragPosition: undefined,
          placedInCells: undefined,
        }
      : piece
  );
}

/**
 * Increment or decrement the rotation value by 0.25.
 */
export function rotatePiece(
  currentRotation: Rotation,
  direction: "clockwise" | "anticlockwise"
): Rotation {
  return direction === "clockwise"
    ? currentRotation + 0.25
    : currentRotation - 0.25;
}

/**
 * Calculate the x y pixel for the shdow based on the current rotation
 */
export const calcShadow = (
  rotation: number,
  isFlippedX: boolean,
  isFlippedY: boolean
): string => {
  switch (getDecimalPart(rotation)) {
    case 25:
      return !isFlippedX && !isFlippedY
        ? "5px -5px"
        : isFlippedX && isFlippedY
        ? "-5px 5px"
        : isFlippedX
        ? "-5px -5px"
        : "5px 5px";
    case 5:
      return !isFlippedX && !isFlippedY
        ? "-5px -5px"
        : isFlippedX && isFlippedY
        ? "5px 5px"
        : isFlippedX
        ? "-5px 5px"
        : "5px -5px";
    case 75:
      return !isFlippedX && !isFlippedY
        ? "-5px 5px"
        : isFlippedX && isFlippedY
        ? "5px -5px"
        : isFlippedX
        ? "5px 5px"
        : "-5px -5px";
    default:
      return !isFlippedX && !isFlippedY
        ? "5px 5px"
        : isFlippedX && isFlippedY
        ? "-5px -5px"
        : isFlippedX
        ? "5px -5px"
        : "-5px 5px";
  }
};

export const calcRadialGradient = (
  rotation: number,
  isFlippedX: boolean,
  isFlippedY: boolean
): string => {
  switch (getDecimalPart(rotation)) {
    case 25:
      return !isFlippedX && !isFlippedY
        ? "30% 70%"
        : isFlippedX && isFlippedY
        ? "70% 30%"
        : isFlippedX
        ? "70% 70%"
        : "30% 30%";
    case 5:
      return !isFlippedX && !isFlippedY
        ? "70% 70%"
        : isFlippedX && isFlippedY
        ? "30% 30%"
        : isFlippedX
        ? "70% 30%"
        : "30% 70%";
    case 75:
      return !isFlippedX && !isFlippedY
        ? "70% 30%"
        : isFlippedX && isFlippedY
        ? "30% 70%"
        : isFlippedX
        ? "30% 30%"
        : "70% 70%";
    default:
      return !isFlippedX && !isFlippedY
        ? "30% 30%"
        : isFlippedX && isFlippedY
        ? "70% 70%"
        : isFlippedX
        ? "30% 70%"
        : "70% 30%";
  }
};

export function getDecimalPart(num: number) {
  if (Number.isInteger(num)) {
    return 0;
  }

  const decimalStr = num.toString().split(".")[1];
  return Number(decimalStr);
}

