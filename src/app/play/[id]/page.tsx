import prisma from "@/lib/prisma";
import { GameArea } from "./GameArea";
import { PieceData, piecesDataSchema } from "./types";
import { calcPlacedPosition } from "./utils";

export async function generateStaticParams() {
  const levels = await prisma.level.findMany();

  return levels.map(({ id }) => ({
    id: id.toString(),
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const level = await prisma.level.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      solutionPieces: true,
    },
  });

  const solution = await prisma.solution.findUnique({
    where: {
      id: level?.solutionId,
    },
    include: {
      solutionPieces: {
        include: {
          piece: true,
        },
      },
    },
  });

  // All solution pieces flattened with their piece data
  const allPieces: PieceData[] =
    solution?.solutionPieces.map(
      ({ piece, id, pieceId, solutionId, ...solutionPiece }) => {
        const shapeParsed = JSON.parse(piece.shape);
        const placedInCellsParsed = solutionPiece?.placedInCells
          ? JSON.parse(solutionPiece.placedInCells)
          : undefined;

        return {
          ...solutionPiece,
          placedInCells: placedInCellsParsed,
          ...piece,
          shape: shapeParsed,
        };
      }
    ) ?? [];

  // Ensure JSON.parsed() shape and placedInCells arrays are valid
  const result = piecesDataSchema.safeParse(allPieces);

  if (result.success) {
    // Extract the preplaced piece for this level from all solution pieces
    const placedPieces = result.data
      .filter((piece) =>
        level?.solutionPieces?.find(
          (solutionPiece) => solutionPiece.pieceId === piece.id
        )
      )
      .map(
        ({
          id,
          shape,
          height,
          width,
          d,
          color,
          rotation,
          isFlippedX,
          isFlippedY,
          placedInCells,
        }) => {
          const previewPiece = placedInCells.reduce(
            (acc, [cellX, cellY]) => {
              return {
                x: cellX < acc.x ? cellX : acc.x,
                y: cellY < acc.y ? cellY : acc.y,
              };
            },
            { x: 10, y: 5 }
          );
          return {
            id,
            shape,
            height,
            width,
            d,
            color,
            initialPosition: { x: 0, y: 0 },
            position: calcPlacedPosition(
              {
                rotation,
                initialPosition: { x: 0, y: 0 },
              },
              { width, height },
              { top: 0, left: 0 },
              previewPiece
            ),
            isActivePiece: false,
            droppedOnBoard: true,
            isLocked: true,
            rotation,
            isFlippedX,
            isFlippedY,
            placedInCells,
          };
        }
      );
    // Extract the game pieces for this levle and add the default values
    const unplacedPieces = result.data
      .filter(
        (piece) =>
          !level?.solutionPieces?.find(
            (solutionPiece) => solutionPiece.pieceId === piece.id
          )
      )
      .map(({ id, shape, height, width, d, color }) => ({
        id,
        shape,
        height,
        width,
        d,
        color,
        initialPosition: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
        isActivePiece: false,
        droppedOnBoard: false,
        isLocked: false,
        rotation: 0,
        isFlippedX: false,
        isFlippedY: false,
      }));

    return (
      <GameArea placedPieces={placedPieces} unplacedPieces={unplacedPieces} />
    );
  } else {
    return <>Error</>;
  }
}
