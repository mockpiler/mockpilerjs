import { TokenChar } from '@mockpiler/lexer'

import {
  NonZeroIntegers,
  StringIntegers,
  StartIdentifierChars,
  LeftIdentifierChars,
  DecrementCounter
} from './constants'
import {
  TrimStart,
  Merge,
  NormalizeNumber,
  ContextType,
  ContextArrayType,
  ContextObjectType
} from './utils'

export type CompileError<
  Scope extends string,
  Message extends string
> = `[Compiling ${Scope}] ${Message}`

export type ParseCount<Input> = ParseNumber<Input> extends infer Result
  ? Result extends [infer N, infer Rest]
    ? Rest extends ''
      ? N
      : false
    : CompileIdent<Input> extends infer Result
    ? Result extends [infer _ /* ident */, infer Rest]
      ? Rest extends ''
        ? ['1']
        : false
      : false
    : never
  : never

export type ParseNumber<
  Input,
  Result extends StringIntegers[] = [],
  Start = true
> = Start extends true
  ? TrimStart<Input> extends `${infer N & NonZeroIntegers}${infer Rest}`
    ? ParseNumber<Rest, [...Result, N & NonZeroIntegers], false>
    : false
  : Input extends `${infer N & StringIntegers}${infer Rest}`
  ? ParseNumber<Rest, [...Result, N & StringIntegers], false>
  : [Result, Input]

export type DecrementNumber<Result extends any[]> = Result extends [infer N]
  ? N extends '0'
    ? [N]
    : [DecrementCounter[N & StringIntegers]]
  : Result extends [...infer Rest, infer N]
  ? N extends '0'
    ? NormalizeNumber<
        [...DecrementNumber<Rest>, DecrementCounter[N & StringIntegers]]
      >
    : NormalizeNumber<[...Rest, DecrementCounter[N & StringIntegers]]>
  : never

export type CompileValue<Input, Context> = CompileRoot<
  Input,
  Context
> extends infer Result
  ? Result extends false
    ? CompileIdent<Input>
    : Result
  : never

export type CompileRoot<
  Input,
  Context
> = TrimStart<Input> extends `${TokenChar.objectStartToken}${infer Properties}`
  ? CompileObject<Properties, Context>
  : TrimStart<Input> extends `${TokenChar.arrayStartToken}${infer Elements}`
  ? CompileArray<Elements, Context>
  : false

export type CompileResult<Result> = Result extends [infer Value, string]
  ? Value
  : Result

export type CompileArray<
  Elements,
  Context,
  Result extends any[] = []
> = TrimStart<Elements> extends `${TokenChar.arrayEndToken}${infer Rest}`
  ? [Result, Rest]
  : TrimStart<Elements> extends `${TokenChar.countStartToken}${infer Count}${TokenChar.countEndToken}${infer Rest}`
  ? CompileValue<Rest, Context> extends [infer Value, infer Rest]
    ? ParseCount<Count> extends infer Count
      ? Count extends [...infer Counter]
        ? CompileCount<Value, Context, Counter> extends infer CountResult
          ? CountResult extends any[]
            ? CompileArray<Rest, Context, [...Result, ...CountResult]>
            : CountResult
          : never
        : never
      : CompileError<'Count', 'Error parsing count'>
    : CompileError<'Array Element', '1 Expecting object, array or identifier'>
  : TrimStart<Elements> extends `${TokenChar.spreadToken}${TokenChar.spreadToken}${TokenChar.spreadToken}${infer RestSpread}`
  ? CompileIdent<RestSpread> extends [infer Ident, infer Rest]
    ? CompileArray<
        Rest,
        Context,
        [...Result, ...ContextArrayType<Context, Ident>]
      >
    : CompileError<'Array Element', 'Expecting identifier on spread expression'>
  : CompileValue<Elements, Context> extends [infer Value, infer Rest]
  ? CompileArray<Rest, Context, [...Result, ContextType<Context, Value>]>
  : CompileError<'Array Element', '2 Expecting object, array or identifier'>

export type CompileCount<
  Value,
  Context,
  Count extends any[],
  Result extends any[] = []
> = Count extends ['0']
  ? Result
  : CompileCount<
      Value,
      Context,
      DecrementNumber<Count>,
      [...Result, ContextType<Context, Value>]
    >

export type CompileObject<
  Properties,
  Context,
  Result extends Record<string, any> = {}
> = TrimStart<Properties> extends `${TokenChar.objectEndToken}${infer Rest}`
  ? [Result, Rest]
  : CompileIdent<Properties> extends [infer Key, infer Rest]
  ? TrimStart<Rest> extends `${TokenChar.objectPairSeparator}${infer Rest}`
    ? CompileValue<Rest, Context> extends [infer Value, infer Rest]
      ? CompileObject<
          Rest,
          Context,
          Merge<Result & { [K in Key & string]: ContextType<Context, Value> }>
        >
      : CompileError<
          'Object Property',
          '1 Expecting object, array or identifier'
        >
    : CompileObject<
        Rest,
        Context,
        Merge<Result & { [K in Key & string]: ContextType<Context, Key> }>
      >
  : TrimStart<Properties> extends `${TokenChar.spreadToken}${TokenChar.spreadToken}${TokenChar.spreadToken}${infer RestSpread}`
  ? CompileIdent<RestSpread> extends [infer Ident, infer Rest]
    ? CompileObject<
        Rest,
        Context,
        Merge<Result & ContextObjectType<Context, Ident>>
      >
    : CompileError<
        'Object Property',
        'Expecting identifier on spread expression'
      >
  : CompileError<'Object Property', '2 Expecting object, array or identifier'>

export type CompileIdent<
  Input
> = TrimStart<Input> extends `${TokenChar.identifierToken}${infer Ident}${TokenChar.identifierToken}${infer Rest}`
  ? [Ident, Rest]
  : ExtractIdent<Input>

export type ExtractIdent<
  Input,
  Result extends string = '',
  Start = true
> = Start extends true
  ? TrimStart<Input> extends `${infer StartIdentChar &
      StartIdentifierChars}${infer Rest}`
    ? ExtractIdent<Rest, `${Result}${StartIdentChar & string}`, false>
    : false
  : Input extends `${infer LeftIdentChar & LeftIdentifierChars}${infer Rest}`
  ? ExtractIdent<Rest, `${Result}${LeftIdentChar & string}`, false>
  : [Result, Input]

export type CompileMock<
  Input,
  Context extends Record<any, any> = {}
> = CompileRoot<Input, Context> extends infer Result
  ? CompileResult<Result> extends infer Result
    ? Result extends false
      ? CompileError<'Root', 'Expecting object or array'>
      : Result
    : never
  : never
