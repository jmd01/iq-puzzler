import { GameArea } from "./GameArea";
import prisma from "@/lib/prisma";

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
    }
  });

  console.log(level);
  return <GameArea />;
}
