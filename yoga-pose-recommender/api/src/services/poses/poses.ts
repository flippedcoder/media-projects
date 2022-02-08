import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

export const poses = () => {
  return db.pose.findMany()
}

export const pose = ({ id }: Prisma.PoseWhereUniqueInput) => {
  return db.pose.findUnique({
    where: { id },
  })
}

export const getPosesByCategory = ({ category }) => {
  return db.pose.findMany({
    where: { category },
  })
}

interface CreatePoseArgs {
  input: Prisma.PoseCreateInput
}

export const createPose = ({ input }: CreatePoseArgs) => {
  return db.pose.create({
    data: input,
  })
}

interface UpdatePoseArgs extends Prisma.PoseWhereUniqueInput {
  input: Prisma.PoseUpdateInput
}

export const updatePose = ({ id, input }: UpdatePoseArgs) => {
  return db.pose.update({
    data: input,
    where: { id },
  })
}

export const deletePose = ({ id }: Prisma.PoseWhereUniqueInput) => {
  return db.pose.delete({
    where: { id },
  })
}
