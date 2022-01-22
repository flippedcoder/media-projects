import { images, image, createImage, updateImage, deleteImage } from './images'
import type { StandardScenario } from './images.scenarios'

describe('images', () => {
  scenario('returns all images', async (scenario: StandardScenario) => {
    const result = await images()

    expect(result.length).toEqual(Object.keys(scenario.image).length)
  })

  scenario('returns a single image', async (scenario: StandardScenario) => {
    const result = await image({ id: scenario.image.one.id })

    expect(result).toEqual(scenario.image.one)
  })

  scenario('creates a image', async () => {
    const result = await createImage({
      input: { name: 'String3509655', description: 'String', url: 'String' },
    })

    expect(result.name).toEqual('String3509655')
    expect(result.description).toEqual('String')
    expect(result.url).toEqual('String')
  })

  scenario('updates a image', async (scenario: StandardScenario) => {
    const original = await image({ id: scenario.image.one.id })
    const result = await updateImage({
      id: original.id,
      input: { name: 'String13595262' },
    })

    expect(result.name).toEqual('String13595262')
  })

  scenario('deletes a image', async (scenario: StandardScenario) => {
    const original = await deleteImage({ id: scenario.image.one.id })
    const result = await image({ id: original.id })

    expect(result).toEqual(null)
  })
})
