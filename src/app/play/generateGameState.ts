import type { GameState } from "./types";

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
