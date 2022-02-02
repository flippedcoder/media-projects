import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    const data: Prisma.VideoCreateInput['data'][] = [
      { url: 'https://res.cloudinary.com/milecia/video/upload/v1606580790/elephant_herd.mp4', srtFile: 'https://res.cloudinary.com/milecia/raw/upload/v1643650731/sample_nyiy7a.srt' }
    ]
    console.log(
      "\nUsing the default './scripts/seed.{js,ts}' template\nEdit the file to add seed data\n"
    )

    Promise.all(
      data.map(async (data: Prisma.VideoCreateInput['data']) => {
        const record = await db.video.create({ data })
        console.log(record)
      })
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
