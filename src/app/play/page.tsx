"use client";

// import { GetServerSideProps } from "next";
import { GameArea } from "./GameArea";
// import prisma from "@/lib/prisma";

// export const getServerSideProps: GetServerSideProps = async () => {
//   const feed = await prisma.level.find({
//     where: {
//       published: true,
//     },
//     include: {
//       author: {
//         select: {
//           name: true,
//         },
//       },
//     },
//   });
//   return {
//     props: { feed },
//   };
// };

export default function Page() {
  return <GameArea />;
}
