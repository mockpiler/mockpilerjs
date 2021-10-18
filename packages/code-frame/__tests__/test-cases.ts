import type { CodeFrameLocation } from '../src'

const targetOneDigitLineToken = 'test-anotherNested'
const targetTwoDigitLineToken = '}'

export const testCode = `
  {
    someNestedArray: [
      someNestedValue
      anotherNestedValue
    ]
    someNestedObject: {
      someNestedProperty
      ${targetOneDigitLineToken}: property
    ${targetTwoDigitLineToken}
    anotherNestedArray: [
      someNestedValue
      anotherNestedValue
    ]
    anotherNestedObject: {
      someNestedProperty
      another: nestedProperty
    }
  }
`

const testLines = testCode.split('\n')

const getTestCodeFrameLocation = (token: string): CodeFrameLocation => ({
  line: testLines.findIndex(line => line.includes(token)) + 1,
  get startColumn() {
    return testLines[this.line - 1].indexOf(token) + 1
  },
  get endColumn() {
    return this.startColumn + token.length
  }
})

export const testOneDigitLineTokenLocation = getTestCodeFrameLocation(
  targetOneDigitLineToken
)
export const testTwoDigitLineTokenLocation = getTestCodeFrameLocation(
  targetTwoDigitLineToken
)
