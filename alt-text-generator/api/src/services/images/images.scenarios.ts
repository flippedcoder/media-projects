import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.ImageCreateArgs>({
  image: {
    one: {
      data: { name: 'String9877994', description: 'String', url: 'String' },
    },
    two: {
      data: { name: 'String7886666', description: 'String', url: 'String' },
    },
  },
})

export type StandardScenario = typeof standard
