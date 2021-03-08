export type CodeFrameOptions = {
  /**
   * Padding chars in LOCs
   */
  padding?: string

  /**
   * Separators for line numbers:
   *
   * <line-number><separator><line-of-code>
   */
  lineNumberSeparator?: string

  /**
   * Indicator for line numbers:
   *
   *  > 1|
   *    2|
   *    3|
   */
  lineNumberIndicator?: string

  /**
   * Indicator for code fragments:
   *
   *   wrong-fragment
   *   ^^^^^^^^^^^^^^
   */
  fragmentIndicator?: string

  /**
   * Lines above the highlighted line
   */
  maxTopLines?: number

  /**
   * Lines below the highlighted line
   */
  maxBottomLines?: number

  /**
   * Escaped chars in token values
   *
   * IMPORTANT: This shouldn't be modified in user-land code
   * -- unless you know what are you doing
   */
  __internal_escapedChars?: Record<string, string>
}

export const defaultCodeFrameOptions: Required<CodeFrameOptions> = {
  padding: ' ',
  lineNumberSeparator: '|',
  lineNumberIndicator: '>',
  fragmentIndicator: '^',
  maxTopLines: 4,
  maxBottomLines: 4,
  __internal_escapedChars: {
    '\n': 'n',
    '\t': 't'
  }
}

export function setDefaultCodeFrameOptions(defaultOptions: CodeFrameOptions) {
  return Object.assign(defaultCodeFrameOptions, defaultOptions)
}
