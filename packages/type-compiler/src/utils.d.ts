import type { Whitespace } from './constants'

export type Identity<T> = T
export type Merge<T> = Identity<{ [K in keyof T]: T[K] }>

export type TrimStart<Input> = Input extends `${Whitespace}${infer Trimmed}`
  ? TrimStart<Trimmed>
  : Input

export type NormalizeNumber<Result extends any[]> = Result extends ['0']
  ? Result
  : Result extends ['0', ...infer Rest]
  ? Rest
  : Result

export type ContextType<Context, Key> = Key extends keyof Context
  ? Context[Key] extends infer Value
    ? Value extends (...args: any[]) => any
      ? ReturnType<Value>
      : Value
    : never
  : Key extends object
  ? Key
  : any
