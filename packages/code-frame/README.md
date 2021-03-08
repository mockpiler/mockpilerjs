# @mockpiler/code-frame

Code-frame generator used internally by MockpilerJS

## Usage

```js
import { scan } from '@mockpiler/lexer'
import { generateCodeFrame } from '@mockpiler/code-frame'

const input = `
  [
    (2) {
      name
      age
    }
  ]
`

const tokens = scan(input)
const tokenIndex = tokens.findIndex(token => token.value === 'age')

console.log(generateCodeFrame(tokens, tokenIndex))

/**
 * Output:
 *
 *    1|
 *    2|  [
 *    3|    (2) {
 *    4|      name
 *  > 5|      age
 *     |      ^^^
 *    6|    }
 *    7|  ]
 *    8|
 */
```
