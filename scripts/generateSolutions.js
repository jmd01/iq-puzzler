"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/app/play/[id]/utils");
const client_1 = require("@prisma/client");
const pieceOrientations_1 = require("./pieceOrientations");
const prisma = new client_1.PrismaClient();
const getPieces = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.piece.findMany();
});
const getNextAvailableCell = (grid, starting = [0, 0]) => {
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
const boardStateGrid = (0, utils_1.generateGameState)(BOARD_SIZE[0], BOARD_SIZE[1], []).grid;
const solutions = [];
const generate = () => __awaiter(void 0, void 0, void 0, function* () {
    const allPieces = (yield getPieces()).map(({ id, shape }) => ({
        id,
        shape: JSON.parse(shape),
    }));
    const remainingPieces = allPieces.map((piece) => piece.id);
    placePiece({
        allPieces,
        remainingPieces,
        boardStateGrid,
        solutionPieces: [],
    });
});
const placePiece = ({ allPieces, remainingPieces, boardStateGrid, solutionPieces, }) => {
    const nextAvailableCell = getNextAvailableCell(boardStateGrid);
    if (!nextAvailableCell) {
        // found a solution
        console.log(solutionPieces);
        solutions.push(solutionPieces);
        return;
    }
    remainingPieces.forEach((pieceId) => {
        const piece = allPieces.find((piece) => piece.id === pieceId);
        if (!piece) {
            throw new Error(`Piece ${pieceId} not found`);
        }
        pieceOrientations_1.pieceOrientations[pieceId].forEach((pieceOrientation) => {
            // check if piece fits
            // if it does, add to boardState
            // else, generate next piece
            const flippedShape = (0, utils_1.getRotatedAndFlippedShape)(piece.shape, pieceOrientation.rotation, pieceOrientation.isFlippedX, pieceOrientation.isFlippedY);
            const pieceOverCells = (0, utils_1.getPieceOverCells)(nextAvailableCell, flippedShape);
            if (pieceOverCells) {
                if ((0, utils_1.getIsPiecePlaceable)(pieceOverCells, boardStateGrid)) {
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
                    const updatedBoardStateGrid = (0, utils_1.addPieceToBoard)(boardStateGrid, pieceOverCells);
                    // remove piece from remainingPieces
                    const updatedRemainingPieces = remainingPieces.filter((id) => piece.id !== id);
                    // place next piece
                    placePiece({
                        allPieces,
                        remainingPieces: updatedRemainingPieces,
                        boardStateGrid: updatedBoardStateGrid,
                        solutionPieces: updatedSolutionPieces,
                    });
                }
            }
        });
    });
};
generate();
//# sourceMappingURL=generateSolutions.js.map