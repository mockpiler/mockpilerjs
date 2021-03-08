/**
 * Test cases
 */

export const validCode = `
  {
    name
    age
    '{complex-key-braces}': name
    '[complex-key-brackets]': age
    matches: [
      person
      ...people
      (3) {
        name
        age
      }
    ]
    'escap\\'ing'
  }
`

export const unknownTokenCode = `
  {
    test,
  }
`
