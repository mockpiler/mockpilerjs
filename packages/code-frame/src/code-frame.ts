import { CodeFrameOptions, defaultCodeFrameOptions } from './options'
import { CharRepeater } from './utils'

export type CodeFrameLocation = {
  line: number
  startColumn: number
  endColumn: number
}

export function generateCodeFrame(
  source: string,
  location: CodeFrameLocation,
  options: CodeFrameOptions = {}
) {
  const mergedOptions = Object.assign(
    {},
    defaultCodeFrameOptions,
    options
  ) as Required<CodeFrameOptions>
  const charRepeater = new CharRepeater(mergedOptions)

  const startLineIndex = Math.max(
    location.line - 1 - mergedOptions.maxTopLines,
    0
  )
  const targetLineIndex = location.line - startLineIndex

  let lines = source.split(/\r?\n/)

  const maxLine = Math.min(
    location.line + mergedOptions.maxBottomLines,
    lines.length
  )

  // Limit by top/bottom max lines
  lines = lines.slice(startLineIndex, maxLine)

  lines.splice(
    targetLineIndex,
    0,
    charRepeater.get('padding', location.startColumn - 1) +
      charRepeater.get(
        'fragmentIndicator',
        location.endColumn - location.startColumn
      )
  )

  const lineNumberPrefixPadding = charRepeater.get(
    'padding',
    String(maxLine).length
  )

  const getLineNumber = (index: number) =>
    startLineIndex + index + (index > targetLineIndex ? 0 : 1)

  const getLineNumberIndicatorPrefix = (index: number) =>
    index === targetLineIndex - 1
      ? charRepeater.get('lineNumberIndicator') + charRepeater.get('padding')
      : charRepeater.get('padding', 2)

  return lines
    .map((line: any, index: any) => {
      const lineNumberIndicatorPrefix = getLineNumberIndicatorPrefix(index)

      const linePrefix = (
        lineNumberPrefixPadding +
        lineNumberIndicatorPrefix +
        (index === targetLineIndex ? '' : getLineNumber(index))
      ).slice(
        -(lineNumberPrefixPadding.length + lineNumberIndicatorPrefix.length)
      )

      return (
        linePrefix +
        charRepeater.get('lineNumberSeparator') +
        line.replace('\t', '\\t')
      )
    })
    .join('\n')
}
