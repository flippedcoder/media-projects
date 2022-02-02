import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const videos = () => {
  return db.video.findMany()
}

export const video = ({ id }: Prisma.VideoWhereUniqueInput) => {
  return db.video.findUnique({
    where: { id },
  })
}

interface CreateVideoArgs {
  input: Prisma.VideoCreateInput
}

export const createVideo = ({ input }: CreateVideoArgs) => {
  return db.video.create({
    data: input,
  })
}

interface UpdateVideoArgs extends Prisma.VideoWhereUniqueInput {
  input: Prisma.VideoUpdateInput
}

export const updateVideo = ({ id, input }: UpdateVideoArgs) => {
  return db.video.update({
    data: input,
    where: { id },
  })
}

export const deleteVideo = ({ id }: Prisma.VideoWhereUniqueInput) => {
  return db.video.delete({
    where: { id },
  })
}
