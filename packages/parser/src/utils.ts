import { TokenChar } from '@mockpiler/lexer'

type CloneFn = <T extends object>(obj: T) => T

export const shallowClone: CloneFn = obj => ({
  ...obj
})

export const deepClone: CloneFn = obj => JSON.parse(JSON.stringify(obj))

export const TRIM_IDENTIFIER_REGEX = new RegExp(
  `^${TokenChar.identifierToken}|${TokenChar.identifierToken}$`,
  'g'
)
