/*
  Warnings:

  - Added the required column `placedinCells` to the `SolutionPiece` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SolutionPiece" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pieceId" INTEGER NOT NULL,
    "rotation" INTEGER NOT NULL,
    "isFlippedX" BOOLEAN NOT NULL,
    "isFlippedY" BOOLEAN NOT NULL,
    "placedinCells" TEXT NOT NULL,
    "solutionId" INTEGER NOT NULL,
    CONSTRAINT "SolutionPiece_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SolutionPiece_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SolutionPiece" ("id", "isFlippedX", "isFlippedY", "pieceId", "rotation", "solutionId") SELECT "id", "isFlippedX", "isFlippedY", "pieceId", "rotation", "solutionId" FROM "SolutionPiece";
DROP TABLE "SolutionPiece";
ALTER TABLE "new_SolutionPiece" RENAME TO "SolutionPiece";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
