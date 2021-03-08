import { invalidTokenCode, validCode } from './test-cases'
import { parse } from '../src'

describe('parser', () => {
  test('should parse valid token sequence', () => {
    expect(parse(validCode)).toMatchSnapshot()
  })

  test('should throw on invalid token', () => {
    expect(() => parse(invalidTokenCode)).toThrowErrorMatchingSnapshot()
  })
})
