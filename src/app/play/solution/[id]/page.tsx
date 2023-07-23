import prisma from "@/lib/prisma";
import { GameArea } from "./GameArea";
import { PieceData, piecesDataSchema } from "../../level/types";
import { calcPlacedPosition, isRotatedSideways } from "../../level/utils/utils";
import { getPlacedRotatedAndFlippedShape } from "../../level/utils/sharedUtils";

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
          layer: piece.id,
          shape: shapeParsed,
        };
      }
    ) ?? [];

  // Ensure JSON.parsed() shape and placedInCells arrays are valid
  const result = piecesDataSchema.safeParse(allPieces);

  if (result.success) {
    const placedPieces = result.data.map(
      ({
        id,
        layer,
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

        const currentShape = getPlacedRotatedAndFlippedShape(
          shape,
          rotation,
          isFlippedX,
          isFlippedY
        );

        return {
          id,
          layer,
          shape,
          currentShape,
          height,
          width,
          d,
          color,
          initialPosition: { x: 0, y: 0 },
          position: calcPlacedPosition(
            {
              rotation: 0,
              initialPosition: { x: 0, y: 0 },
            },
            isRotatedSideways(rotation) ? { height, width } : { width, height },
            { top: 0, left: 0 },
            previewPiece,
            true
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

    return <GameArea placedPieces={placedPieces} unplacedPieces={[]} />;
  } else {
    return <>Error</>;
  }
}
