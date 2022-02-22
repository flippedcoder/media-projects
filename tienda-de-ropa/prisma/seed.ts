import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const products: Prisma.ProductCreateInput[] = [
  {
      name: 'Blue Shirt',
      category: 'Tops',
      price: 29.99,
      image: 'https://res.cloudinary.com/milecia/image/upload/v1606580778/3dogs.jpg',
      description: 'Blue shirt with dog print'
  },
  {
      name: 'Taupe Pants',
      category: 'Bottoms',
      price: 59.99,
      image: 'https://res.cloudinary.com/milecia/image/upload/v1606580780/beach-boat.jpg',
      description: 'Ankle length pants'
  },
  {
      name: 'Black Patent Leather Oxfords',
      category: 'Shoes',
      price: 99.99,
      image: 'https://res.cloudinary.com/milecia/image/upload/v1606580772/dessert.jpg',
      description: 'Ankle high dress shoes'
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    })
    console.log(`Created product with id: ${product.id}`)
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