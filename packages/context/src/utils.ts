import { MockContextAccessor, MockContextInput } from './types'

export const getEncodedMockContextKey = (n: number) => n.toString(36)

export const unknownIdent = Symbol('MockPiler.UnknownIdent')

export class RawValue {
  constructor(public raw: any) {}
}

export function raw(value: any) {
  return new RawValue(value)
}

/**
 * Utility function to get a context accessor
 * from a plain context object
 *
 * @param input
 */
export function getMockContextAccessor(
  input: MockContextInput
): MockContextAccessor {
  if (typeof input === 'function') {
    return input as any
  }

  // Generate an accessor based on given input
  return key => (key in input ? input[key] : unknownIdent)
}

/**
 * Merges given plain context objects or accessors
 *
 * @param inputs
 */
export function mergeMockContexts(
  ...inputs: MockContextInput[]
): MockContextAccessor {
  const accessors = inputs.map(getMockContextAccessor)

  return key => {
    for (const accessor of accessors) {
      const result = accessor(key)

      if (result !== unknownIdent) {
        return result
      }
    }

    return unknownIdent
  }
}
