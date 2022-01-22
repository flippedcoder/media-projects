import { render } from '@redwoodjs/testing/web'

import ImagePage from './ImagePage'

describe('ImagePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImagePage />)
    }).not.toThrow()
  })
})
