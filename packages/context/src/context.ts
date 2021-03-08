import { ContextualizeResult, MockContext, MockContextInput } from './types'
import {
  getMockContextAccessor,
  getEncodedMockContextKey,
  RawValue
} from './utils'

export function contextualizeTemplate(
  templateStrings: TemplateStringsArray,
  values: any[],
  input: MockContextInput
): ContextualizeResult {
  const accessor = getMockContextAccessor(input)

  let [template] = templateStrings
  const randomContextKey = getEncodedMockContextKey(Math.random()).slice(2)

  const rootContext: MockContext = {}
  const rootContextProxy = new Proxy(rootContext, {
    get(target, key: string) {
      return Reflect.has(target, key) ? target[key] : accessor(key)
    }
  })

  values.forEach((value, index) => {
    if (value instanceof RawValue) {
      template += `${value.raw}${templateStrings[index + 1]}`
    } else {
      const contextKey = `__mockpiler__${randomContextKey}_${getEncodedMockContextKey(
        index
      )}`

      rootContext[contextKey] = value
      template += `'${contextKey}'${templateStrings[index + 1]}`
    }
  })

  return {
    template,
    context: rootContextProxy
  }
}
