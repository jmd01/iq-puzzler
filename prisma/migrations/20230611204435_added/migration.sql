-- CreateTable
CREATE TABLE "_PieceToSolutionPiece" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PieceToSolutionPiece_A_fkey" FOREIGN KEY ("A") REFERENCES "Piece" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PieceToSolutionPiece_B_fkey" FOREIGN KEY ("B") REFERENCES "SolutionPiece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PieceToSolutionPiece_AB_unique" ON "_PieceToSolutionPiece"("A", "B");

-- CreateIndex
CREATE INDEX "_PieceToSolutionPiece_B_index" ON "_PieceToSolutionPiece"("B");
