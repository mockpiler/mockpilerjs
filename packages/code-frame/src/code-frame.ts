import { Token } from '@mockpiler/lexer'

import { CodeFrameBuffer } from './buffer'
import { CodeFrameOptions, defaultCodeFrameOptions } from './options'
import { getPadding } from './utils'

export function generateCodeFrame(
  tokens: Token[],
  highlightTokenIndex: number,
  options: CodeFrameOptions = {}
) {
  const mergedOptions = Object.assign(
    {},
    defaultCodeFrameOptions,
    options
  ) as Required<CodeFrameOptions>

  const { location: highlightLocation, value: highlightValue } = tokens[
    highlightTokenIndex
  ]

  const MIN_LINE = Math.max(
    highlightLocation.start.line - mergedOptions.maxTopLines,
    1
  )

  const MAX_LINE = Math.min(
    highlightLocation.start.line + mergedOptions.maxBottomLines,
    tokens[tokens.length - 1].location.start.line
  )

  const buffer = new CodeFrameBuffer(MIN_LINE, MAX_LINE, mergedOptions)

  buffer.addLine(highlightLocation.start.line, highlightValue)

  let upperIndex = highlightTokenIndex - 1
  let lowerIndex = highlightTokenIndex + 1

  let upperToken: Token
  let lowerToken: Token

  let prevUpperTokenStartLocation = highlightLocation.start
  let prevLowerTokenEndLocation = highlightLocation.end

  /**
   * Build upper code block
   */
  while (
    upperIndex >= 0 &&
    (upperToken = tokens[upperIndex--]).location.start.line >= MIN_LINE
  ) {
    const {
      value,
      location: { start, end }
    } = upperToken

    if (buffer.hasLine(start.line)) {
      buffer.prependToLine(
        start.line,
        value,
        getPadding(
          mergedOptions.padding,
          prevUpperTokenStartLocation.column - end.column
        )
      )
    } else {
      buffer.addLine(start.line, value)
      buffer.prependToLine(
        prevUpperTokenStartLocation.line,
        getPadding(
          mergedOptions.padding,
          prevUpperTokenStartLocation.column - 1
        )
      )
    }

    prevUpperTokenStartLocation = start
  }

  buffer.prependToLine(
    prevUpperTokenStartLocation.line,
    getPadding(mergedOptions.padding, prevUpperTokenStartLocation.column - 1)
  )

  /**
   * Build lower code block
   */
  while (
    lowerIndex < tokens.length &&
    (lowerToken = tokens[lowerIndex++]).location.start.line <= MAX_LINE
  ) {
    const {
      value,
      location: { start, end }
    } = lowerToken

    if (!buffer.hasLine(start.line)) {
      buffer.addLine(
        start.line,
        getPadding(mergedOptions.padding, start.column - 1),
        value
      )
    } else {
      buffer.appendToLine(
        start.line,
        getPadding(
          mergedOptions.padding,
          start.column - prevLowerTokenEndLocation.column
        ),
        value
      )
    }

    prevLowerTokenEndLocation = end
  }

  return buffer.getFormattedOutput(highlightLocation)
}
