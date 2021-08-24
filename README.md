# MockpilerJS

Generate mock data using a dead simple JSON-like language.

## Installation

```bash
# Using npm
$ npm install @mockpiler/compiler

# Using yarn
$ yarn add @mockpiler/compiler

# Using pnpm
$ pnpm add @mockpiler/compiler
```

## Usage

```js
import { mock, helpers as contextHelpers } from '@mockpiler/compiler'

const context = {
  name: 'John Doe',
  randomAge() {
    return Math.floor(Math.random() * 100)
  },
  randomFruit: contextHelpers.pick([
    'watermelon',
    'strawberry',
    'pineapple',
    'apple'
  ])
  // Same as:
  //
  // randomFruit() {
  //  const fruits = ['watermelon', 'strawberry', 'pineapple', 'apple']
  //
  //  return fruits[Math.floor(Math.random() * fruits.length)]
  // }
}

const people = mock(context)`
  [
    (2) {
      name
      age: randomAge
      favoriteFruits: [
        (3) randomFruit
      ]
    }
  ]
`

// or using interpolation

const people = mock`
  [
    (2) {
      name: ${context.name}
      age: ${context.randomAge}
      favoriteFruits: [
        (3) ${context.randomFruit}
      ]
    }
  ]
`

console.log(people)

/**
 * Example output:
 *
 * [
 *   {
 *     name: 'John Doe',
 *     age: 33,
 *     favoriteFruits: [
 *       'watermelon',
 *       'pineapple',
 *       'apple'
 *     ]
 *   },
 *   {
 *     name: 'John Doe',
 *     age: 56,
 *     favoriteFruits: [
 *       'strawberry',
 *       'pineapple',
 *       'apple'
 *     ]
 *   }
 * ]
 */
```

## Context helpers

See documentation for the API and usage [here](./packages/context/README.md#helpers)
