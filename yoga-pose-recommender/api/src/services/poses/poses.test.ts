import { poses, pose, createPose, updatePose, deletePose } from './poses'
import type { StandardScenario } from './poses.scenarios'

describe('poses', () => {
  scenario('returns all poses', async (scenario: StandardScenario) => {
    const result = await poses()

    expect(result.length).toEqual(Object.keys(scenario.pose).length)
  })

  scenario('returns a single pose', async (scenario: StandardScenario) => {
    const result = await pose({ id: scenario.pose.one.id })

    expect(result).toEqual(scenario.pose.one)
  })

  scenario('creates a pose', async () => {
    const result = await createPose({
      input: {
        name: 'String',
        url: 'String',
        you_url: 'String',
        category: 'String',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.url).toEqual('String')
    expect(result.you_url).toEqual('String')
    expect(result.category).toEqual('String')
  })

  scenario('updates a pose', async (scenario: StandardScenario) => {
    const original = await pose({ id: scenario.pose.one.id })
    const result = await updatePose({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a pose', async (scenario: StandardScenario) => {
    const original = await deletePose({ id: scenario.pose.one.id })
    const result = await pose({ id: original.id })

    expect(result).toEqual(null)
  })
})
