import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export type Document = {
  id: string;
  title: string;
  content: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document>
) {
  const docData = req.body;
  const newDoc = await prisma.document.create({
    data: {
      title: docData.title,
      content: docData.content,
    },
  });

  res.status(200).json(newDoc);

  await prisma.$disconnect();
}
