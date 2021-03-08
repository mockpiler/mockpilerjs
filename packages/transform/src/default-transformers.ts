import type { TransformFn } from './types'

const MapTransform: TransformFn<
  Array<[unknown, unknown]> | Record<string, unknown>,
  Map<any, any>
> = value => {
  if (Array.isArray(value)) {
    return new Map(value)
  }

  if (typeof value !== 'object' || value === null) {
    throw new TypeError('Invalid value')
  }

  const map = new Map()
  const keys = Object.keys(value)

  for (const key of keys) {
    map.set(key, value[key])
  }

  return map
}

const SetTransform: TransformFn<any[], Set<any>> = value => {
  if (!Array.isArray(value)) {
    throw new TypeError('Invalid value')
  }

  return new Set(value)
}

export const transformers = {
  ToMap: MapTransform,
  ToSet: SetTransform
}
