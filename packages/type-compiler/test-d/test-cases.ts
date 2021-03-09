export type ExpectedObject = {
  name: string
  age: number
}

export const input = `
  [
    (2) {
      name
      age
    }
  ]
`

export const context: ExpectedObject = {
  name: 'John Doe',
  age: 33
}
