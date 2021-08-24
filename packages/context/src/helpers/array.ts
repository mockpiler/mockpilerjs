export const randomIndex = (array: any[]): number =>
  Math.floor(Math.random() * array.length)

export function index(array: any[]) {
  return () => randomIndex(array)
}

export function pick<T>(
  array: T[],
  // TODO: Is this really needed?
  indexPicker = randomIndex
) {
  return () => array[indexPicker(array)]
}

export function tape<T>(array: T[]) {
  let index = 0
  const { length } = array

  return () => array[index++ % length]
}
