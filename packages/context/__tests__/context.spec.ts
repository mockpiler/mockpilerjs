import './test-patch'
import { contextualizeTemplate } from '../src'

const contextualizeTemplateTag = (
  template: TemplateStringsArray,
  ...values: any[]
) => contextualizeTemplate(template, values, {})

describe('context', () => {
  test('should contextualize template correctly', () => {
    const { template, context } = contextualizeTemplateTag`
  {
    key: ${'value'}
    array: [
      (2) {
        obj: ${{ n: 10 }}
      }
    ]
  }
`

    expect(template).toMatchSnapshot()

    // Note: We have to spread context since 'pretty-format'
    // has collisions with proxies
    expect({ ...context }).toMatchSnapshot()
  })
})
