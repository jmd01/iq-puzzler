import prisma from "@/lib/prisma";
import Solution from "./Solution";

export async function generateStaticParams() {
  const levels = await prisma.level.findMany();

  return levels.map(({ id }) => ({
    id: id.toString(),
  }));
}

export default async function Page({ params }: { params: { id: number } }) {
  return <Solution level={params.id} />;
}
