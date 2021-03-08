export type MockContextAccessor = (key: string) => any

export interface MockContext {
  [key: string]: any
}

export type MockContextInput = MockContext | MockContextAccessor

export type ContextualizeResult = {
  template: string
  context: MockContext // proxified context
}
