import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.PoseCreateArgs>({
  pose: {
    one: {
      data: {
        name: 'String',
        url: 'String',
        you_url: 'String',
        category: 'String',
      },
    },
    two: {
      data: {
        name: 'String',
        url: 'String',
        you_url: 'String',
        category: 'String',
      },
    },
  },
})

export type StandardScenario = typeof standard
