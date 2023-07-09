import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getSolutions = async () => {
  return await prisma.solution.findMany({
    include: {
      solutionPieces: true,
    },
  });
};

getSolutions().then((solutions) => {
  const noIdSolutions = solutions.map(({ id, ...rest }) =>
    JSON.stringify(rest)
  );
  console.log(noIdSolutions);

  const uniqueSolutions = [...new Set(noIdSolutions)];
  console.log("Unique Solutions:", uniqueSolutions.length);
});
