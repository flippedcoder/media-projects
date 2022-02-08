import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const data: Prisma.PoseCreateInput['data'][] = [
      { name: 'tree-pose', url: 'https://res.cloudinary.com/milecia/image/upload/v1643844329/test0/tree-pose-blank_fnvhr9.png', you_url: 'https://res.cloudinary.com/milecia/image/upload/v1643844329/test0/tree-pose-blank_fnvhr9.png', category: 'upright'},
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    Promise.all(
      data.map(async (data: Prisma.PoseCreateInput['data']) => {
        const record = await db.pose.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
