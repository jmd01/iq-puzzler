/*
  Warnings:

  - You are about to alter the column `rotation` on the `SolutionPiece` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SolutionPiece" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pieceId" INTEGER NOT NULL,
    "rotation" REAL NOT NULL,
    "isFlippedX" BOOLEAN NOT NULL,
    "isFlippedY" BOOLEAN NOT NULL,
    "placedInCells" TEXT NOT NULL,
    "solutionId" INTEGER NOT NULL,
    CONSTRAINT "SolutionPiece_pieceId_fkey" FOREIGN KEY ("pieceId") REFERENCES "Piece" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SolutionPiece_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SolutionPiece" ("id", "isFlippedX", "isFlippedY", "pieceId", "placedInCells", "rotation", "solutionId") SELECT "id", "isFlippedX", "isFlippedY", "pieceId", "placedInCells", "rotation", "solutionId" FROM "SolutionPiece";
DROP TABLE "SolutionPiece";
ALTER TABLE "new_SolutionPiece" RENAME TO "SolutionPiece";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
