import { render } from '@redwoodjs/testing/web'

import VideoPage from './VideoPage'

describe('VideoPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<VideoPage />)
    }).not.toThrow()
  })
})
