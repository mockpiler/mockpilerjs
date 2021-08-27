# @mockpiler/context

Context utilities used by MockpilerJS

## Helpers

```ts
import { helpers } from '@mockpiler/context'
// or import { helpers } from '@mockpiler/compiler'
```

### Array

#### `pick(array[, indexPicker])`

Generates a `context function` to randomly pick an item from the given `array`. You can optionally pass an `indexPicker` function to customize the selection.

**Usage:**

```ts
const context = {
  alphabet: helpers.pick(['a', 'b', 'c', 'd', 'e']),
  firstLetter: helpers.pick(['a', 'b', 'c', 'd', 'e'], () => 0)
}

context.alphabet() // Randomly get => 'b'
helpers.firstLetter() // Always get first item => 'a'
```

#### `tape(array)`

Generates a `context function` to sequentially pick an item from the given `array`. After reaching the last item, it will start picking again from the beginning.

**Usage:**

```ts
const context = {
  number: helpers.tape(['one', 'two'])
}

context.number() // => 'one'
context.number() // => 'two'
context.number() // => 'one' again
```

#### `index(array)`

Generates a `context function` to randomly get an index from the given `array`.

```ts
const context = {
  index: helpers.index(['one', 'two', 'three'])
}

context.index() // Randomly => 1
```

### Object

#### `lottery(object[, keys])`

Generates a `context function` to randomly pick a value from the given `object`. Optionally, you can pass an array of keys to pick from.

```ts
const user = {
  name: 'John Doe',
  age: 30
}

const context = {
  userValue: helpers.lottery(user),
  userName: helpers.lottery(user, ['name'])
}

context.userValue() // Randomly => 30
context.userName() // Always get => 'John Doe'
```

#### `path(keyPath)`

Generates a `context function` to access nested values by using a dot-delimited `keyPath`.

**Note:** It also handles accesses to `context function`s by calling them before accessing their return values.

```ts
const context = {
  image: () => ({
    urls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    size: {
      width: {
        px: 100
      },
      height: {
        px: 200
      }
    }
  }),
  firstImageUrl: helpers.path('image.urls.0'),
  imageWidth: helpers.path('image.size.width.px')
}

context.firstImageUrl() // => 'https://example.com/image1.jpg'
context.imageWidth() // => 100
```

### Miscellaneous

#### `cacheFirst(fn)`

Generates a `context function` to cache the first result from a given `context function`.

```ts
const randomNumber = helpers.pick([30, 50, 100, 40, 80])

const context = {
  number: helpers.cacheFirst(randomNumber)
}

context.number() // => 30
context.number() // subsequent calls gets the same value => 30
```

### Definitions

#### `context function`

A `context function` is just a function that returns a value. It can be used to generate a random value,
access nested values, etc.

```ts
const context = {
  number: () => Math.random() * 100
}

mock(context)`
  {
    id: number
  }
`
```

`Mockpiler` automatically will catch any `context function`s in the `mock` definition and call them before generating the mock.

The previous example will generate something like:

```json
{
  "id": 30
}
```
