-- CreateTable
CREATE TABLE "Piece" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shape" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "d" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "SolutionPiece" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rotation" INTEGER NOT NULL,
    "isFlippedX" BOOLEAN NOT NULL,
    "isFlippedY" BOOLEAN NOT NULL,
    "solutionId" INTEGER NOT NULL,
    CONSTRAINT "SolutionPiece_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Level" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "solutionId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LevelToSolutionPiece" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LevelToSolutionPiece_A_fkey" FOREIGN KEY ("A") REFERENCES "Level" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LevelToSolutionPiece_B_fkey" FOREIGN KEY ("B") REFERENCES "SolutionPiece" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_LevelToSolutionPiece_AB_unique" ON "_LevelToSolutionPiece"("A", "B");

-- CreateIndex
CREATE INDEX "_LevelToSolutionPiece_B_index" ON "_LevelToSolutionPiece"("B");
