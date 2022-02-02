import { videos, video, createVideo, updateVideo, deleteVideo } from './videos'
import type { StandardScenario } from './videos.scenarios'

describe('videos', () => {
  scenario('returns all videos', async (scenario: StandardScenario) => {
    const result = await videos()

    expect(result.length).toEqual(Object.keys(scenario.video).length)
  })

  scenario('returns a single video', async (scenario: StandardScenario) => {
    const result = await video({ id: scenario.video.one.id })

    expect(result).toEqual(scenario.video.one)
  })

  scenario('creates a video', async () => {
    const result = await createVideo({
      input: { url: 'String', srtFile: 'String' },
    })

    expect(result.url).toEqual('String')
    expect(result.srtFile).toEqual('String')
  })

  scenario('updates a video', async (scenario: StandardScenario) => {
    const original = await video({ id: scenario.video.one.id })
    const result = await updateVideo({
      id: original.id,
      input: { url: 'String2' },
    })

    expect(result.url).toEqual('String2')
  })

  scenario('deletes a video', async (scenario: StandardScenario) => {
    const original = await deleteVideo({ id: scenario.video.one.id })
    const result = await video({ id: original.id })

    expect(result).toEqual(null)
  })
})
