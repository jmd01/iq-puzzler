import { Piece, PieceData } from "./types";

export const generatePieces = (piecesData: PieceData[]): Piece[] =>
  piecesData.map((pieceData) => ({
    ...pieceData,
    initialPosition: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    isActivePiece: false,
    droppedOnBoard: false,
    isLocked: false,
  }));
