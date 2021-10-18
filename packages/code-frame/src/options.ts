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
}

export const defaultCodeFrameOptions: Required<CodeFrameOptions> = {
  padding: ' ',
  lineNumberSeparator: '|',
  lineNumberIndicator: '>',
  fragmentIndicator: '^',
  maxTopLines: 4,
  maxBottomLines: 4
}

export function setDefaultCodeFrameOptions(defaultOptions: CodeFrameOptions) {
  return Object.assign(defaultCodeFrameOptions, defaultOptions)
}
