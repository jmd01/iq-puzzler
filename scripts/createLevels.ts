import { Difficulty } from "../src/app/play/level/types";
import { PrismaClient, Solution, SolutionPiece } from "@prisma/client";

const prisma = new PrismaClient();

const getSolutions = async () => {
  return await prisma.solution.findMany({
    // include: {
    //   solutionPieces: true,
    // },
  });
};

type SolutionWithPieces = Solution & {
  // solutionPieces: SolutionPiece[];
  difficulty: Difficulty;
};
/**
 * Create levels from all the solutions
 */
getSolutions().then((solutions) => {
  const groupedSolutions = solutions.reduce<
    Record<Difficulty, SolutionWithPieces[]>
  >(
    (acc, item) => {
      const difficulty = getDifficulty(item.id);
      return {
        ...acc,
        [difficulty]: [...acc[difficulty], { ...item, difficulty }],
      };
    },
    {
      EASY: [],
      INTERMEDIATE: [],
      EXPERT: [],
      WIZARD: [],
    }
  );

  const sortedSolutions = [
    ...groupedSolutions.EASY,
    ...groupedSolutions.INTERMEDIATE,
    ...groupedSolutions.EXPERT,
    ...groupedSolutions.WIZARD,
  ];

  sortedSolutions.map(async (solution, index) => {
    return await prisma.level.create({
      data: {
        id: index + 1,
        difficulty: solution.difficulty,
        solutionId: solution.id,
        solutionPieces: {
          connect: getRandomSolutionPieces(solution.difficulty).map((id) => ({
            id,
          })),
        },
      },
    });
  });
});

const getDifficulty = (id: number): Difficulty => {
  const modulo = (id % 4) as 1 | 2 | 3 | 0;
  switch (modulo) {
    case 1:
      return "EASY";
    case 2:
      return "INTERMEDIATE";
    case 3:
      return "EXPERT";
    case 0:
      return "WIZARD";
  }
};

/**
 * Returns an array of 12 numbers in random order
 */
const shuffle = () => {
  return [...Array(12)]
    .map((_, i) => i + 1)
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

/**
 * Return the first x number of ids from the shuffled array
 */
const getRandomSolutionPieces = (difficulty: Difficulty): number[] => {
  switch (difficulty) {
    case "EASY":
      return shuffle().slice(0, 8);
    case "INTERMEDIATE":
      return shuffle().slice(0, 6);
    case "EXPERT":
      return shuffle().slice(0, 4);
    case "WIZARD":
      return shuffle().slice(0, 2);
    default:
      throw new Error("Invalid difficulty:" + difficulty);
  }
};
