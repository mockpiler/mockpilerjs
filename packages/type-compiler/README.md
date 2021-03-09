# @mockpiler/type-compiler

Types compilation for MockpilerJS

> Status: **Experimental**
>
> _Requires typescript >= 4.1.0_

## Usage

```ts
import type { CompileMock } from '@mockpiler/type-compiler'
import { mock } from '@mockpiler/compiler'

const input = `
  [
    (2) {
      name
      age
    }
  ]
`

const context = {
  name: 'John Doe',
  age: 33
}

const result = mock(input, context) as CompileMock<typeof input, typeof context>
```
