import {
  Token,
  TokenChar,
  TokenLocation,
  TokenType,
  scan,
  Lexer
} from '@mockpiler/lexer'
import { generateCodeFrame } from '@mockpiler/code-frame'

import {
  AstArrayNode,
  AstElementNode,
  AstIdentifierNode,
  AstNodeType,
  AstObjectNode,
  AstPropertyNode,
  AstRootNode,
  AstSpreadNode,
  AstTransformNode,
  AstValueNode
} from './ast'
import { deepClone, shallowClone, TRIM_IDENTIFIER_REGEX } from './utils'

export class ParserError extends Error {
  name = 'ParserError'
}

export class Parser {
  index = 0
  current: Token

  protected _scanIterator: Generator<Token>

  constructor(public lexer: Lexer) {
    // Reset probably re-used lexer
    lexer.reset()

    this._scanIterator = lexer.scan()
    this.current = this._scanIterator.next().value
  }

  parse() {
    return this.parseRoot()
  }

  parseRoot(): AstRootNode {
    const value: AstRootNode['value'] | null =
      this.parseArray() ?? this.parseObject()

    if (!value) {
      this.throwUnexpected([
        TokenChar.arrayStartToken,
        TokenChar.objectStartToken
      ])
    }

    const eofToken = this.current

    if (eofToken.type !== TokenType.EOF) {
      this.throwUnexpected([TokenType.EOF])
    }

    return {
      type: AstNodeType.Root,
      value: value!,
      location: {
        start: { line: 1, column: 1 },
        end: shallowClone(eofToken.location.end)
      }
    }
  }

  parseArray(): AstArrayNode | null {
    if (!this.is(TokenChar.arrayStartToken)) {
      return null
    }

    const startLocation: TokenLocation = shallowClone(
      this.current.location.start
    )
    const elements: AstArrayNode['elements'] = []

    // Skip start token `[`
    this.next()

    while (this.current && !this.is(TokenChar.arrayEndToken)) {
      elements.push(this.parseSpread() ?? this.parseElement())
    }

    this.expect(TokenChar.arrayEndToken)

    const endLocation = shallowClone(this.current.location.end)

    // Skip end token `]`
    this.next()

    return {
      type: AstNodeType.Array,
      elements,
      location: {
        start: startLocation,
        end: endLocation
      }
    }
  }

  parseElement(): AstElementNode {
    let count: AstElementNode['count'] | null
    let startLocation: TokenLocation | null = null

    if (!this.is(TokenChar.countStartToken)) {
      count = 1
    } else {
      startLocation = shallowClone(this.current.location.start)

      // Skip leading count token `(`<-$count)
      this.next()

      const token = this.current

      if (token.type === TokenType.countNumber) {
        count = token.value as number
        this.next()
      } else {
        count = this.parseIdentifier()

        if (!count) {
          this.throwUnexpected([TokenType.count])
        }
      }

      this.expect(TokenChar.countEndToken)

      // Skip trailing count token ($count->`)`
      this.next()
    }

    const value: AstElementNode['value'] | null = this.parseValue()

    if (!value) {
      this.throwUnexpectedValue()
    }

    return {
      type: AstNodeType.Element,
      count: count!,
      value: value!,
      location: {
        start: startLocation ?? shallowClone(value!.location.start),
        end: shallowClone(value!.location.end)
      }
    }
  }

  parseObject(): AstObjectNode | null {
    if (!this.is(TokenChar.objectStartToken)) {
      return null
    }

    const startLocation: TokenLocation = shallowClone(
      this.current.location.start
    )
    const properties: AstObjectNode['properties'] = []

    // Skip start token `{`
    this.next()

    while (this.current && !this.is(TokenChar.objectEndToken)) {
      properties.push(this.parseSpread() ?? this.parseProperty())
    }

    this.expect(TokenChar.objectEndToken)

    const endLocation = shallowClone(this.current.location.end)

    // Skip end token `}`
    this.next()

    return {
      type: AstNodeType.Object,
      properties,
      location: {
        start: startLocation,
        end: endLocation
      }
    }
  }

  parseProperty(): AstPropertyNode {
    const key = this.parseIdentifier()

    if (!key) {
      this.throwUnexpectedIdentifier()
    }

    let value: AstPropertyNode['value'] | null

    if (!this.is(TokenChar.objectPairSeparator)) {
      // Copy key node
      value = deepClone(key!)
    } else {
      // Skip `:`
      this.next()

      if (!(value = this.parseValue())) {
        this.throwUnexpectedValue()
      }
    }

    return {
      type: AstNodeType.Property,
      key: key!,
      value: value!,
      location: {
        start: shallowClone(key!.location.start),
        end: shallowClone(value!.location.end)
      }
    }
  }

  parseSpread(): AstSpreadNode | null {
    const spreadToken = this.current

    if (spreadToken.type !== TokenType.spread) {
      return null
    }

    // Skip spread token
    this.next()

    const identifier = this.parseIdentifier()

    if (!identifier) {
      this.throwUnexpectedIdentifier()
    }

    return {
      type: AstNodeType.Spread,
      identifier: identifier!,
      location: {
        start: shallowClone(spreadToken.location.start),
        end: shallowClone(identifier!.location.end)
      }
    }
  }

  parseTransform(
    transformer: AstIdentifierNode | null
  ): AstIdentifierNode | AstTransformNode | null {
    if (!transformer || !this.is(TokenChar.transformToken)) {
      return transformer
    }

    // Skip transform token
    this.next()

    const value = this.parseValue()

    if (!value) {
      this.throwUnexpectedValue()
    }

    return {
      type: AstNodeType.Transform,
      transformer,
      value: value!,
      location: {
        start: shallowClone(transformer.location.start),
        end: shallowClone(value!.location.end)
      }
    }
  }

  parseIdentifier(): AstIdentifierNode | null {
    const identifier = this.current

    if (identifier.type !== TokenType.identifier) {
      return null
    }

    // Advance to next token
    this.next()

    return {
      type: AstNodeType.Identifier,
      name: (identifier.value as string).replace(TRIM_IDENTIFIER_REGEX, ''),
      location: deepClone(identifier.location)
    }
  }

  parseValue(): AstValueNode | null {
    return (
      this.parseArray() ??
      this.parseObject() ??
      this.parseTransform(this.parseIdentifier())
    )
  }

  expect(token: TokenChar) {
    if (this.current.type === TokenType.EOF) {
      throw new ParserError('Unexpected EOF')
    }

    if (!this.is(token)) {
      this.throwUnexpected([token])
    }
  }

  throwUnexpectedIdentifier() {
    this.throwUnexpected([TokenType.identifier])
  }

  throwUnexpectedValue() {
    this.throwUnexpected([
      TokenChar.arrayStartToken,
      TokenChar.objectStartToken,
      TokenType.identifier
    ])
  }

  throwUnexpected(expected: string[]) {
    const token = this.current

    this.throwWithCodeFrame(
      `Unexpected ${
        token.type === TokenType.EOF ? 'EOF' : `token: ${token.value}`
      }. Expecting ${expected.join(', ')}`
    )
  }

  throwWithCodeFrame(message: string) {
    throw new ParserError(
      [
        null,
        `${generateCodeFrame(this.lexer.input, {
          line: this.current.location.start.line,
          startColumn: this.current.location.start.column,
          endColumn: this.current.location.end.column
        })}`,
        message
      ].join('\n\n')
    )
  }

  is(value: string) {
    return this.current.value === value
  }

  next() {
    const nextToken = this._scanIterator.next()
    return (this.current = nextToken.value)
  }
}

export function parse(input: string) {
  return new Parser(new Lexer(input)).parse()
}
