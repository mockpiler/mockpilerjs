import type { CodeFrameOptions } from './options'

type CharRepeaterOptions = Omit<
  Required<CodeFrameOptions>,
  'maxTopLines' | 'maxBottomLines'
>

export class CharRepeater {
  private _checkedChars = new Set<keyof CharRepeaterOptions>()

  constructor(private _options: CharRepeaterOptions) {}

  get(key: keyof CharRepeaterOptions, count = 1) {
    const value = this._options[key]

    if (!this._checkedChars.has(key)) {
      if (value.length !== 1) {
        throw new Error(`Option '${key}' must be of length 1`)
      }

      this._checkedChars.add(key)
    }

    return value.repeat(count)
  }
}
