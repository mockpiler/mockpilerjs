import { testTokenIndex, testTokens } from './test-cases'
import { generateCodeFrame } from '../src'

describe('code-frame', () => {
  test('generate valid code-frame', () => {
    expect(
      `\n${generateCodeFrame(testTokens, testTokenIndex)}`
    ).toMatchSnapshot()
  })
})
