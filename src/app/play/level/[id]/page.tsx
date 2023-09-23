import prisma from "@/lib/prisma";
import Level from "./Level";

export async function generateStaticParams() {
  // const levels = await prisma.level.findFirst();
  return [
    {
      id: "1",
    },
    {
      id: "2",
    },
  ];
  // const levels = await prisma.level.findMany();

  // return levels.map(({ id }) => ({
  //   id: id.toString(),
  // }));
}

export default async function Page({ params }: { params: { id: number } }) {
  return <Level level={params.id} />;
}
