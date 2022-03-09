import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/prisma'

type Palette = {
  name: string
  src: string
  colorHigh: string
  colorMid: string
  colorLow: string
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await handleGET(req, res)
  } else if (req.method === 'POST') {
    await handlePOST(req, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/images
const handleGET = async (req: NextApiRequest, res: NextApiResponse<Palette[]>) => {
  const colorPalettes = await prisma.colorPalette.findMany()
  res.status(200).json(colorPalettes)
}

// POST /api/images
const handlePOST = async (req: NextApiRequest, res: NextApiResponse<Palette>) => {
  const newColorPalette = JSON.parse(req.body)

  const result = await prisma.colorPalette.create({
    data: {
      name: newColorPalette.name,
      src: newColorPalette.src,
      colorHigh: newColorPalette.colorHigh,
      colorMid: newColorPalette.colorMid,
      colorLow: newColorPalette.colorLow,
    },
  })

  res.status(200).json(result)
}
