import { transformers } from '../src'

describe('transform', () => {
  test('should apply ToMap transform correctly', () => {
    expect(
      transformers.ToMap([
        ['key', 'value'],
        [{}, []]
      ])
    ).toMatchSnapshot()

    expect(
      transformers.ToMap({
        name: 'John Doe',
        age: 33
      })
    ).toMatchSnapshot()
  })

  test('should apply ToSet transform correctly', () => {
    expect(
      transformers.ToSet(['name', 'John Doe', 'age', 33])
    ).toMatchSnapshot()
  })
})
