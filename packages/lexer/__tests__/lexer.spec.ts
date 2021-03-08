import { unknownTokenCode, validCode } from './test-cases'
import { LexerError, scan } from '../src'

describe('lexer', () => {
  test('should scan valid code', () => {
    expect(scan(validCode)).toMatchSnapshot()
  })

  test('should throw on unknown token', () => {
    expect(() => scan(unknownTokenCode)).toThrowError(
      new LexerError("Unknown token ',' at 3:9")
    )
  })
})
