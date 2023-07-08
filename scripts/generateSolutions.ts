import {
  addPieceToBoard,
  generateGameState,
  getIsPiecePlaceable,
  getPieceOverCells,
  getRotatedAndFlippedShape,
  nestedCopy,
} from "../src/app/play/[id]/sharedUtils";
import { PrismaClient, SolutionPiece } from "@prisma/client";
import { pieceOrientations } from "./pieceOrientations";
import { connect } from "http2";

type GeneratedSolutionPiece = Omit<
  SolutionPiece,
  "id" | "solutionId" | "placedInCells"
> & {
  placedInCells: [number, number][];
};
const prisma = new PrismaClient();

const getPieces = async () => {
  return await prisma.piece.findMany();
};

export const getNextAvailableCell = (
  grid: number[][],
  starting: [number, number] = [0, 0]
): [number, number] | false => {
  let x = starting[0];
  let y = starting[1];
  // console.log({ x, y });

  for (y; y < grid.length; y++) {
    for (x; x < grid[0].length; x++) {
      if (grid[y][x] === 0) {
        return [x, y];
      }
    }
    x = 0;
  }
  return false;
};

const BOARD_SIZE = [11, 5];
const boardStateGrid = generateGameState(BOARD_SIZE[0], BOARD_SIZE[1], []).grid;
const solutions: GeneratedSolutionPiece[][] = [];

const generate = async () => {
  const allPieces = (await getPieces()).map(({ id, shape }) => ({
    id,
    shape: JSON.parse(shape) as [number, number][],
  }));
  const remainingPieces = allPieces.map((piece) => piece.id);
  placePiece({
    allPieces,
    remainingPieces,
    boardGrid: boardStateGrid,
    solutionPieces: [],
  });
};

const placePiece = async ({
  allPieces,
  remainingPieces,
  boardGrid,
  solutionPieces,
  previousAvailableCell,
}: {
  allPieces: { id: number; shape: [number, number][] }[];
  remainingPieces: number[];
  boardGrid: number[][];
  solutionPieces: GeneratedSolutionPiece[];
  previousAvailableCell?: [number, number];
}) => {
  const nextAvailableCell = getNextAvailableCell(
    boardGrid,
    previousAvailableCell
  );
  // console.log({ nextAvailableCell, remainingPieces });
  // printBoard(boardGrid);

  if (!nextAvailableCell) {
    // found a solution
    // solutions.push(solutionPieces);
    console.count("Found a solution!");
    // console.log({ nextAvailableCell, remainingPieces });
    // printBoard(boardGrid);
    await prisma.solution.create({
      data: {
        solutionPieces: {
          create: solutionPieces.map(
            ({ rotation, isFlippedX, isFlippedY, placedInCells, pieceId }) => ({
              rotation,
              isFlippedX,
              isFlippedY,
              placedInCells: JSON.stringify(placedInCells),

              piece: {
                connect: { id: pieceId },
              },
            })
          ),
        },
      },
    });
    return;
  }

  remainingPieces.forEach((pieceId) => {
    const piece = allPieces.find((piece) => piece.id === pieceId);

    if (!piece) {
      throw new Error(`Piece ${pieceId} not found`);
    }

    // console.log("Current piece: ", pieceId);
    // printShape(piece.shape);

    pieceOrientations[pieceId].forEach((pieceOrientation) => {
      const flippedShape = getRotatedAndFlippedShape(
        piece.shape,
        pieceOrientation.rotation,
        pieceOrientation.isFlippedX,
        pieceOrientation.isFlippedY
      );

      const pieceOverCells = getPieceOverCells(nextAvailableCell, flippedShape);

      if (pieceOverCells) {
        if (getIsPiecePlaceable(pieceOverCells, boardGrid)) {
          const updatedSolutionPieces = [
            ...nestedCopy(solutionPieces),
            {
              pieceId: piece.id,
              rotation: pieceOrientation.rotation,
              isFlippedX: pieceOrientation.isFlippedX,
              isFlippedY: pieceOrientation.isFlippedY,
              placedInCells: pieceOverCells,
            },
          ];

          // add piece to boardState
          const updatedBoardGrid = addPieceToBoard(boardGrid, pieceOverCells);

          // remove piece from remainingPieces
          const updatedRemainingPieces = remainingPieces.filter(
            (id) => piece.id !== id
          );

          if (!hasUnfillableCells(updatedBoardGrid)) {
            // console.log("Piece placed", {
            //   id: piece.id,
            //   pieceOrientation,
            //   pieceOverCells,
            // });
            // console.log("Piece placed");
            // printShape(flippedShape);
            // printBoard(updatedBoardGrid);

            // place next piece
            placePiece({
              allPieces,
              remainingPieces: updatedRemainingPieces,
              boardGrid: updatedBoardGrid,
              solutionPieces: updatedSolutionPieces,
              previousAvailableCell: [...nextAvailableCell],
            });
          }
        }
      }
    });
    // console.log("Piece not placeable: ", pieceId);
  });
};

const printBoard = (boardStateGrid: number[][]) => {
  console.log("boardStateGrid:");
  boardStateGrid.forEach((row) => {
    console.log(row.join(" "));
  });
  console.log(" ");
};

const printShape = (shape: number[][]) => {
  console.log("Piece shape:");
  shape.forEach((row) => {
    console.log(row.join(" "));
  });
  console.log(" ");
};

/**
 * Check if there are any cells that are not filled in but are surrounded by filled in cells
 */
const hasUnfillableCells = (grid: number[][]) => {
  return grid.some((row, y) =>
    row.some((cell, x) => {
      return (
        cell === 0 &&
        getSurroundingCells(grid, x, y).every(([x, y]) => grid[y][x] === 1)
      );
    })
  );
};

/**
 * Get the grid position of the cells that are above below and to the left and right of the cell
 */

const getSurroundingCells = (
  grid: number[][],
  x: number,
  y: number
): [number, number][] => {
  const surroundingCells: [number, number][] = [];

  if (x > 0) {
    surroundingCells.push([x - 1, y]);
  }
  if (y > 0) {
    surroundingCells.push([x, y - 1]);
  }
  if (x < grid[0].length - 1) {
    surroundingCells.push([x + 1, y]);
  }
  if (y < grid.length - 1) {
    surroundingCells.push([x, y + 1]);
  }

  return surroundingCells;
};

generate();
