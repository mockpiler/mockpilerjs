import { randomIndex } from './array'

export function lottery<T extends object>(
  object: T,
  keys = Object.keys(object)
) {
  return (): T extends { [key: string]: infer V } ? V : never => {
    const key = keys[randomIndex(keys)]

    return (object as any)[key]
  }
}

export function path(keyPath: string) {
  const keys = keyPath.split('.')

  if (keys.length === 1) {
    throw new Error(`Invalid path: ${path}`)
  }

  return function (this: any) {
    let value = this[keys[0]]

    if (typeof value === 'function') {
      value = value()
    }

    for (let i = 1; i < keys.length; i++) {
      value = value[keys[i]]
    }

    return value
  }
}
