"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecimalPart = exports.getFlippedShape = exports.getRotatedShape = exports.getRotatedAndFlippedShape = exports.getPieceOverCells = exports.getIsPiecePlaceable = exports.generateGameState = exports.addPieceToBoard = exports.nestedCopy = void 0;
/**
 * Simple utility for deep copying an array.
 * NB: Only works for scalar values and objects (no functions, Symbols etc)
 */
function nestedCopy(array) {
    return JSON.parse(JSON.stringify(array));
}
exports.nestedCopy = nestedCopy;
/**
 * On drag end, if the active piece is over the board and placeable, there will be a preview piece. This function will add the preview piece to the board
 */
function addPieceToBoard(gameStateGrid, previewPieceCell) {
    const updatedGrid = nestedCopy(gameStateGrid);
    previewPieceCell.forEach(([x, y]) => {
        if (updatedGrid[y][x] === 1) {
            console.error(`Trying to place piece on board at {x:${x}, y:${y}} but cell is already taken.`);
        }
        updatedGrid[y][x] = 1;
    });
    return updatedGrid;
}
exports.addPieceToBoard = addPieceToBoard;
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
function generateGameState(x, y, prePlacedPieces) {
    // Create an empty grid
    let grid = Array(y).fill(Array(x).fill(0));
    // Fill it with the preplaced pieces
    prePlacedPieces &&
        prePlacedPieces.forEach(({ placedInCells }) => {
            grid = addPieceToBoard(grid, placedInCells);
        });
    return {
        grid,
        complete: false,
    };
}
exports.generateGameState = generateGameState;
/**
 * Check if all the cells the piece will cover are empty
 */
const getIsPiecePlaceable = (pieceOverCells, gameStateGrid) => pieceOverCells.every(([x, y]) => {
    return gameStateGrid[y] && gameStateGrid[y][x] === 0;
});
exports.getIsPiecePlaceable = getIsPiecePlaceable;
/**
 * Get the cells on the board that a piece will cover if dropped on the board
 * in the format [[x,y],[x,y],[x,y]]
 */
const getPieceOverCells = (boardCell, shape) => {
    return shape.reduce((acc, currentRow, y) => {
        return currentRow.reduce((rowAcc, coversCell, x) => {
            const cell = [boardCell[0] + x, boardCell[1] + y];
            return coversCell ? (rowAcc ? [...rowAcc, cell] : [cell]) : rowAcc;
        }, acc);
    }, undefined);
};
exports.getPieceOverCells = getPieceOverCells;
const getRotatedAndFlippedShape = (pieceShape, pieceRotation, pieceIsFlippedX, pieceIsFlippedY) => {
    const rotatedShape = getRotatedShape(pieceShape, pieceRotation);
    return getFlippedShape(rotatedShape, pieceIsFlippedX, pieceIsFlippedY);
};
exports.getRotatedAndFlippedShape = getRotatedAndFlippedShape;
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
function getRotatedShape(pieceShape, pieceRotation) {
    const pieceShapeClone = nestedCopy(pieceShape);
    switch (getDecimalPart(pieceRotation)) {
        case 0:
            return pieceShapeClone;
        case 25:
            return pieceShapeClone[0].map((_, index) => pieceShapeClone.map((row) => row[index]).reverse());
        case 5:
            return [...pieceShapeClone.reverse()].map((row) => row.reverse());
        case 75:
            return pieceShapeClone[0].map((_, index) => pieceShapeClone.map((row) => row[row.length - 1 - index]));
        default:
            return pieceShapeClone;
    }
}
exports.getRotatedShape = getRotatedShape;
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
function getFlippedShape(pieceShape, pieceIsFlippedX, pieceIsFlippedY) {
    let flippedShape = nestedCopy(pieceShape);
    if (pieceIsFlippedX) {
        flippedShape = flippedShape.reverse();
    }
    if (pieceIsFlippedY) {
        flippedShape = flippedShape.map((row) => row.reverse());
    }
    return flippedShape;
}
exports.getFlippedShape = getFlippedShape;
function getDecimalPart(num) {
    if (Number.isInteger(num)) {
        return 0;
    }
    const decimalStr = num.toString().split(".")[1];
    return Number(decimalStr);
}
exports.getDecimalPart = getDecimalPart;
