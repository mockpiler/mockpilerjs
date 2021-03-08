# @mockpiler/lexer

Lexical Analyzer for MockpilerJS

## Usage

```js
import { Lexer } from '@mockpiler/lexer'

const input = `
  [
    (2) {
      name
      age
    }
  ]
`

const lexer = new Lexer(input)
const tokens = lexer.scan()

console.log(tokens)

/**
 * Output:
 *
 *  [
 *    {
 *      type: 'array',
 *      value: '[',
 *      location: {
 *        start: {
 *          line: 2,
 *          column: 3
 *        },
 *        end: ...
 *      }
 *    },
 *    ...
 *  ]
 */
```
