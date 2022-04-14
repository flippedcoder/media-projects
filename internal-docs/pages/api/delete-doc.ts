import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Document } from "./new-doc";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Document>
) {
  const docId = req.body;

  const deleteProduct = await prisma.document.delete({
    where: { id: docId },
  });

  res.status(200).json(deleteProduct);

  await prisma.$disconnect();
}
