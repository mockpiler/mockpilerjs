export enum TokenChar {
  /**
   * Array tokens
   */
  arrayStartToken = '[',
  arrayEndToken = ']',

  /**
   * Object tokens
   */
  objectStartToken = '{',
  objectEndToken = '}',
  objectPairSeparator = ':',

  /**
   * Count tokens
   */
  countStartToken = '(',
  countEndToken = ')',

  /**
   * Identifier tokens
   */
  identifierToken = "'",

  /**
   * Escape tokens
   */
  escapeToken = '\\',

  /**
   * Spread tokens
   */
  spreadToken = '.',

  /**
   * Transform tokens
   */
  transformToken = '>'
}

export enum TokenType {
  identifier = 'identifier',
  spread = 'spread',
  transform = 'transform',
  object = 'object',
  array = 'array',
  count = 'count',
  countNumber = 'countNumber',
  EOF = 'EOF'
}

export interface TokenLocation {
  line: number
  column: number
}

export type TokenValue = number | string

export interface Token {
  type: TokenType
  value: TokenValue
  location: {
    start: TokenLocation
    end: TokenLocation
  }
}
