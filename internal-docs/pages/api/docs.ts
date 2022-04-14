import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Document } from "./new-doc";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document | Document[] | null>
) {
  const { id } = req.query;

  if (id) {
    const document = await prisma.document.findUnique({
      where: {
        id: id as string,
      },
    });

    res.status(200).json(document);

    await prisma.$disconnect();
  } else {
    const documents = await prisma.document.findMany();

    res.status(200).json(documents);

    await prisma.$disconnect();
  }
}
