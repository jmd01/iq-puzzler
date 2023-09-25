import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PieceData } from "../../../../play/level/types";

export { generateStaticParams } from "../page";

export async function GET(_: Request, { params }: { params: { id: string } }) {
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
  return NextResponse.json({ level, allPieces });
}

export const dynamic = "force-static";
