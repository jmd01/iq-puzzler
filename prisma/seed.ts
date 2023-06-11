import { PrismaClient } from "@prisma/client";
import { pieces } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  const res = await pieces.forEach(
    async (piece) =>
      await prisma.piece.create({
        data: { ...piece, shape: JSON.stringify(piece.shape) },
      })
  );
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
