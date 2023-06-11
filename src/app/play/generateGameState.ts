import type { GameState, Piece } from "./types";
import { addPieceToBoard } from "./utils";

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
  prePlacedPieces?: [string, NonNullable<Piece["placedInCells"]>][]
): GameState {
  // Create an empty grid
  let grid: [number][] = Array(y).fill(Array(x).fill(0));

  // Fill it with the preplaced pieces
  prePlacedPieces &&
    prePlacedPieces.forEach(([, placedInCells]) => {
      grid = addPieceToBoard(grid, placedInCells);
    });

  return {
    grid,
    complete: false,
  };
}

export const prePlacedPieces: [string, NonNullable<Piece["placedInCells"]>][] =
  [
    [
      "2",
      [
        [3, 0],
        [3, 1],
        [3, 2],
        [4, 2],
        [4, 3],
      ],
    ],
    [
      "3",
      [
        [4, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [6, 1],
      ],
    ],
    [
      "4",
      [
        [8, 0],
        [9, 0],
        [10, 0],
        [8, 1],
        [10, 1],
      ],
    ],
    [
      "6",
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 2],
      ],
    ],
    [
      "11",
      [
        [2, 0],
        [1, 1],
        [2, 1],
        [1, 2],
      ],
    ],
  ];
