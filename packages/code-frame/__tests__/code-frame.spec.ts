import {
  testCode,
  testOneDigitLineTokenLocation,
  testTwoDigitLineTokenLocation
} from './test-cases'
import { CodeFrameLocation, generateCodeFrame } from '../src'

const getCodeFrame = (location: CodeFrameLocation) =>
  `\n${generateCodeFrame(testCode, location)}\n`

describe('code-frame', () => {
  test('generate valid code-frame', () => {
    // Test one-digit line number
    expect(getCodeFrame(testOneDigitLineTokenLocation)).toMatchSnapshot()

    // Test two-digit line number
    expect(getCodeFrame(testTwoDigitLineTokenLocation)).toMatchSnapshot()
  })
})
