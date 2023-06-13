import { PrismaClient } from "@prisma/client";
import { pieces, solutionPieces } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  // const res = await pieces.forEach(
  //   async (piece) =>
  //     await prisma.piece.create({
  //       data: { ...piece, shape: JSON.stringify(piece.shape) },
  //     })
  // );
  const res = await prisma.solution.create({
    data: {
      solutionPieces: {
        create: solutionPieces.map(({id, placedInCells, ...solutionPiece}) => ({
          ...solutionPiece,
          placedInCells: JSON.stringify(placedInCells),
          piece: {
            connect: {
              id
            }
          }
        }))
      }
    },
  });
  console.log(res);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
