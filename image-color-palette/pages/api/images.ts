// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/prisma'

type Image = {
  name: string
  src: string
  colorHigh: string
  colorMid: string
  colorLow: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Image[]>
) {

  const fakeImages = [
    {
      name: 'beach',
      src: 'https://res.cloudinary.com/milecia/image/upload/v1606580780/beach-boat.jpg',
      colorHigh: '#5B97BF',
      colorMid: '#BCC9B5',
      colorLow: '#E7D7C0'
    },
    {
      name: 'dogs',
      src: 'https://res.cloudinary.com/milecia/image/upload/v1606580778/3dogs.jpg',
      colorHigh: '#A1582F',
      colorMid: '#FDE2C4',
      colorLow: '#EC9758'
    },
    {
      name: 'flowers',
      src: 'https://res.cloudinary.com/milecia/image/upload/v1606580768/sample.jpg',
      colorHigh: '#F8C734',
      colorMid: '#F71A2C',
      colorLow: '#7C992B'
    }
  ]
  
  res.status(200).json(fakeImages)
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    handleGET(req, res)
  } else if (req.method === 'POST') {
    handlePOST(req, res)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    )
  }
}

// GET /api/images
async function handleGET(req, res) {
  const colorPalettes = await prisma.colorPalette.findMany()
  res.json(colorPalettes)
}

// POST /api/images
async function handlePOST(req, res) {
  const { name, src, colorHigh, colorMid, colorLow } = req.body
  const result = await prisma.colorPalette.create({
    data: {
      name: name,
      src: src,
      colorHigh: colorHigh,
      colorMid: colorMid,
      colorLow: colorLow,
    },
  })
  res.json(result)
}
