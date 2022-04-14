import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Document } from "./new-doc";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document>
) {
  const docData = req.body;

  const updatedDoc = await prisma.document.update({
    where: { id: docData.id },
    data: {
      title: docData.title,
      content: docData.content,
    },
  });

  res.status(200).json(updatedDoc);

  await prisma.$disconnect();
}
