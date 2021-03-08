import { Token } from '@mockpiler/lexer'

import { CodeFrameOptions } from './options'
import { getFragmentIndicator, getPadding } from './utils'

export class CodeFrameBuffer {
  linesBuffer: { [line: number]: string } = {}
  escapeCharsRegex: RegExp

  constructor(
    public minLine: number,
    public maxLine: number,
    public options: Required<CodeFrameOptions>
  ) {
    this.escapeCharsRegex = new RegExp(
      `(${Object.keys(options.__internal_escapedChars).join('|')})`,
      'g'
    )
  }

  hasLine(line: number) {
    return line in this.linesBuffer
  }

  addLine(line: number, ...values: any[]) {
    this.linesBuffer[line] = values.join('')
  }

  prependToLine(line: number, ...values: any[]) {
    this.linesBuffer[line] = values.join('') + this.linesBuffer[line]
  }

  appendToLine(line: number, ...values: any[]) {
    this.linesBuffer[line] += values.join('')
  }

  getFormattedOutput(highlightLocation: Token['location']) {
    const formattedCode = []
    const maxLineLength = String(this.maxLine).length
    const lineIndicatorSpacing = this.options.lineNumberIndicator.length + 1

    for (let line = this.minLine; line <= this.maxLine; line++) {
      const inHighlightLine = line === highlightLocation.start.line
      const lineValue = this.linesBuffer[line] ?? ''

      // Used as extra padding in the highlighted line
      let escapeCharsOffset = 0

      formattedCode.push(
        (inHighlightLine ? this.options.lineNumberIndicator : '') +
          getPadding(
            this.options.padding,
            (inHighlightLine
              ? this.options.lineNumberIndicator.length
              : lineIndicatorSpacing) +
              maxLineLength -
              String(line).length
          ) +
          line +
          this.options.lineNumberSeparator +
          lineValue.replace(this.escapeCharsRegex, escapeChar => {
            escapeCharsOffset++
            return `\\${this.options.__internal_escapedChars[escapeChar]}`
          })
      )

      if (inHighlightLine) {
        formattedCode.push(
          getPadding(
            this.options.padding,
            maxLineLength + lineIndicatorSpacing
          ) +
            this.options.lineNumberSeparator +
            getPadding(
              this.options.padding,
              highlightLocation.start.column - 1 + escapeCharsOffset
            ) +
            getFragmentIndicator(
              this.options.fragmentIndicator,
              highlightLocation.end.column - highlightLocation.start.column
            )
        )
      }
    }

    return formattedCode.join('\n')
  }
}
