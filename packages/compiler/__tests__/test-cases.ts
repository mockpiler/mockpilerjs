import {
  MockContext,
  MockContextAccessor,
  unknownIdent
} from '@mockpiler/context'

// Borrow test cases from lexer
export * from '../../lexer/__tests__/test-cases'

export const validContext: MockContext = {
  name: 'Test',
  "escap'ing": 'escaped',
  age() {
    return 40
  },
  person() {
    return {
      name: this.name,
      age: this.age()
    }
  },
  people() {
    return [this.person(), this.person()]
  }
}

export const customContextAccessor: MockContextAccessor = key => {
  return key !== 'unknown' ? key : unknownIdent
}
