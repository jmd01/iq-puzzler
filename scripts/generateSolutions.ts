import {
  addPieceToBoard,
  generateGameState,
  getIsPiecePlaceable,
  getPieceOverCells,
  getRotatedAndFlippedShape,
} from "../src/app/play/[id]/sharedUtils";
import { PrismaClient, SolutionPiece } from "@prisma/client";
import { pieceOrientations } from "./pieceOrientations";

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

const getNextAvailableCell = (
  grid: [number][],
  starting: [number, number] = [0, 0]
): [number, number] | false => {
  let y = starting[1];
  let x = starting[0];
  for (y; y <= grid.length; y++) {
    for (x; x <= grid[0].length; x++) {
      if (grid[x][y] === 0) {
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
    boardStateGrid,
    solutionPieces: [],
  });
};

const placePiece = ({
  allPieces,
  remainingPieces,
  boardStateGrid,
  solutionPieces,
}: {
  allPieces: { id: number; shape: [number, number][] }[];
  remainingPieces: number[];
  boardStateGrid: [number][];
  solutionPieces: GeneratedSolutionPiece[];
}) => {
  const nextAvailableCell = getNextAvailableCell(boardStateGrid);
  console.log({ nextAvailableCell, remainingPieces, hi: "hi" });
  printBoard(boardStateGrid);

  if (!nextAvailableCell) {
    // found a solution
    solutions.push(solutionPieces);
    console.log("found a solition", { solutionPieces, solutions });
    return;
  }

  remainingPieces.forEach((pieceId) => {
    const piece = allPieces.find((piece) => piece.id === pieceId);
    // console.log({ pieceId, piece });

    if (!piece) {
      throw new Error(`Piece ${pieceId} not found`);
    }

    pieceOrientations[pieceId].forEach((pieceOrientation) => {


      // check if piece fits
      // if it does, add to boardState
      // else, generate next piece
      const flippedShape = getRotatedAndFlippedShape(
        piece.shape,
        pieceOrientation.rotation,
        pieceOrientation.isFlippedX,
        pieceOrientation.isFlippedY
      );

      const pieceOverCells = getPieceOverCells(nextAvailableCell, flippedShape);

      if (pieceOverCells) {
        if (getIsPiecePlaceable(pieceOverCells, boardStateGrid)) {
          const updatedSolutionPieces = [
            ...solutionPieces,
            {
              pieceId: piece.id,
              rotation: pieceOrientation.rotation,
              isFlippedX: pieceOrientation.isFlippedX,
              isFlippedY: pieceOrientation.isFlippedY,
              placedInCells: pieceOverCells,
            },
          ];

          // add piece to boardState
          const updatedBoardStateGrid = addPieceToBoard(
            boardStateGrid,
            pieceOverCells
          );

          // remove piece from remainingPieces
          const updatedRemainingPieces = remainingPieces.filter(
            (id) => piece.id !== id
          );

          // place next piece
          placePiece({
            allPieces,
            remainingPieces: updatedRemainingPieces,
            boardStateGrid: updatedBoardStateGrid,
            solutionPieces: updatedSolutionPieces,
          });
        }
        console.log("piece not placeable", {pieceId, pieceOrientation}); 
      }
    });
  });
};

const printBoard = (boardStateGrid: [number][]) => {
  boardStateGrid.forEach((row) => {
    console.log(row);
  });
}

generate();
