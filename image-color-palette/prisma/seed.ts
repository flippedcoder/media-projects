import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.ImageCreateInput[] = [
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

async function main() {
  console.log(`Start seeding ...`)
  for (const cp of colorPaletteData) {
    const colorPalette = await prisma.colorPalette.create({
      data: cp,
    })
    console.log(`Created color palette with id: ${colorPalette.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })