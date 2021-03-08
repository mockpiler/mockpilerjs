import { scan, TokenType } from '@mockpiler/lexer'

const targetIdentifierToken = 'test-anotherNested'

const code = `
  {
    someNestedArray: [
      someNestedValue
      anotherNestedValue
    ]
    someNestedObject: {
      someNestedProperty
      ${targetIdentifierToken}: property
    }
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

export const testTokens = scan(code)

export const testTokenIndex = testTokens.findIndex(
  token =>
    token.type === TokenType.identifier && token.value === targetIdentifierToken
)
