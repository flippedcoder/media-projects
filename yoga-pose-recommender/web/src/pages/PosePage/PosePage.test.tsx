import { render } from '@redwoodjs/testing/web'

import PosePage from './PosePage'

describe('PosePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PosePage />)
    }).not.toThrow()
  })
})
