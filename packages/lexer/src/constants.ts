import { TokenChar } from './token'

const makeGroupRegex = (group: string[]) =>
  new RegExp(`[${group.join('')}]`, 'i')

/**
 * Valid start identifier chars are:
 *
 *   1. An underscore: _
 *   2. Any uppercase or lowercase letter
 */
export const START_IDENTIFIER_CHARS = ['_', 'a-z']
export const START_IDENTIFIER_REGEX = makeGroupRegex(START_IDENTIFIER_CHARS)

/**
 * Valid identifiers chars remain are:
 *
 *   1. Any start identifier char
 *   2. Hyphens: -
 *   3. Dots: .
 */
export const IDENTIFIER_CHARS = ['-', '.']
export const IDENTIFIER_REGEX = makeGroupRegex([
  ...START_IDENTIFIER_CHARS,
  ...IDENTIFIER_CHARS
])

/**
 * Chars to be ignored during scanning
 */
export const IGNORED_CHARS = ['\r']

/**
 * Count of spaces by tab char
 */
export const TAB_SPACE_SIZE = 4

export const COUNT_DIGIT_REGEX = /\d/
export const LINE_CHAR = '\n'
export const TAB_CHAR = '\t'
export const SPACE_CHAR = ' '
export const SPREAD_SIZE = 3
export const ARRAY_TOKENS = [TokenChar.arrayStartToken, TokenChar.arrayEndToken]
export const COUNT_TOKENS = [TokenChar.countStartToken, TokenChar.countEndToken]
export const OBJECT_TOKENS = [
  TokenChar.objectStartToken,
  TokenChar.objectEndToken,
  TokenChar.objectPairSeparator
]
