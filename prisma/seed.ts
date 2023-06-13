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
  // const res = await prisma.solution.create({
  //   data: {
  //     solutionPieces: {
  //       create: solutionPieces.map(({id, placedInCells, ...solutionPiece}) => ({
  //         ...solutionPiece,
  //         placedInCells: JSON.stringify(placedInCells),
  //         piece: {
  //           connect: {
  //             id
  //           }
  //         }
  //       }))
  //     }
  //   },
  // });
  // const res = await prisma.level.create({
  //   data: {
  //     difficulty: "EASY",
  //     solutionId: 1,
  //     solutionPieces: {
  //       connect: [
  //         {
  //           id: 1,
  //         },
  //         {
  //           id: 2,
  //         },
  //         {
  //           id: 3,
  //         },
  //         {
  //           id: 4,
  //         },
  //       ],
  //     },
  //   },
  // });
  const res = await prisma.level.create({
    data: {
      difficulty: "EASY",
      solutionId: 1,
      solutionPieces: {
        connect: [
          {
            id: 5,
          },
          {
            id: 6,
          },
          {
            id: 7,
          },
          {
            id: 8,
          },
        ],
      },
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
