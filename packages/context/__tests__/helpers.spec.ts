import { helpers } from '../src'

describe('helpers', () => {
  // Test Array
  test('array#pick', () => {
    const values = [1, 'one', { one: 1 }, [1]]
    const randomPick = helpers.pick(values)
    const peek = helpers.pick(values, arr => arr.length - 1)

    for (let run = 0; run < 10; run++) {
      expect(values.includes(randomPick())).toBe(true)
      expect(peek()).toBe(values[values.length - 1])
    }
  })

  test('array#tape', () => {
    let currentIndex = 0
    const values = [3, 2, 1]
    const getValue = helpers.tape(values)

    for (let run = 0; run < 10; run++) {
      expect(getValue()).toBe(values[currentIndex++ % values.length])
    }
  })

  test('array#index', () => {
    const values = new Array(100)
    const getIndex = helpers.index(values)

    for (let run = 0; run < 10; run++) {
      const index = getIndex()

      expect(index).toBeLessThan(values.length)
      expect(index).toBeGreaterThanOrEqual(0)
    }
  })

  // Test object
  test('object#lottery', () => {
    const user = {
      name: 'John Son',
      age: 30
    }

    const values = Object.values(user)
    const getRandomValue = helpers.lottery(values)

    for (let run = 0; run < 10; run++) {
      expect(values.includes(getRandomValue())).toBe(true)
    }
  })

  test('object#path', () => {
    const obj = {
      nestedObj() {
        return {
          some: {
            nested: ['value']
          }
        }
      }
    }

    const getNestedValue = helpers.path('nestedObj.some.nested.0')

    expect(getNestedValue.call(obj)).toBe('value')
  })

  // Test misc (currently unused by me)
  test.todo('cacheFirst')
})
