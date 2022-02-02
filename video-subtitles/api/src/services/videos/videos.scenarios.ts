import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.VideoCreateArgs>({
  video: {
    one: { data: { url: 'String', srtFile: 'String' } },
    two: { data: { url: 'String', srtFile: 'String' } },
  },
})

export type StandardScenario = typeof standard
