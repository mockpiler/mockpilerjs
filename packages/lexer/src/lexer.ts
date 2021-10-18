import { generateCodeFrame } from '@mockpiler/code-frame'
import {
  ARRAY_TOKENS,
  COUNT_DIGIT_REGEX,
  COUNT_TOKENS,
  IDENTIFIER_REGEX,
  IGNORED_CHARS,
  LINE_CHAR,
  OBJECT_TOKENS,
  SPACE_CHAR,
  SPREAD_SIZE,
  START_IDENTIFIER_REGEX,
  TAB_CHAR,
  TAB_SPACE_SIZE
} from './constants'
import { TokenChar, TokenType, Token, TokenLocation } from './token'

export class LexerError extends Error {
  name = 'LexerError'
}

export class Lexer {
  index = 0
  line = 1
  column = 1

  constructor(public input: string) {}

  is(expectation: RegExp | string | string[], offset?: number) {
    return typeof expectation === 'string'
      ? this.peek(offset) === expectation
      : Array.isArray(expectation)
      ? expectation.indexOf(this.peek(offset)) > -1
      : expectation.test(this.peek(offset))
  }

  peek(offset = 0) {
    return this.input[this.index + offset]
  }

  advance(increment = 1) {
    this.index += increment
    this.column += increment

    return this.peek()
  }

  getLocation(): TokenLocation {
    return {
      line: this.line,
      column: this.column
    }
  }

  scanToken(type: TokenType): Token {
    return {
      type,
      value: this.peek(),
      location: {
        start: this.getLocation(),
        end: (this.advance(), this.getLocation())
      }
    }
  }

  scanSpread(): Token {
    const startLocation = this.getLocation()

    // Skip spread chars
    this.advance(SPREAD_SIZE)

    return {
      type: TokenType.spread,
      value: TokenChar.spreadToken.repeat(SPREAD_SIZE),
      location: {
        start: startLocation,
        end: this.getLocation()
      }
    }
  }

  scanIdent(): Token {
    let ident = this.peek() // Save leading identifier token
    let escaping = false

    const start = this.getLocation()

    while (
      this.advance() &&
      (!this.is(TokenChar.identifierToken) || escaping)
    ) {
      escaping = !escaping && this.is(TokenChar.escapeToken)

      // Avoid appending escaping char
      if (!escaping) {
        ident += this.peek()
      }
    }

    if (!this.peek()) {
      throw new LexerError('Unexpected EOF')
    }

    // Save trailing identifier token
    ident += this.peek()

    // Skip trailing identifier token
    this.advance()

    return {
      type: TokenType.identifier,
      value: ident,
      location: {
        start,
        end: this.getLocation()
      }
    }
  }

  scanRegex(type: TokenType, regex: RegExp): Token {
    let value = this.peek()
    const start = this.getLocation()

    while (this.advance() && regex.test(this.peek())) {
      value += this.peek()
    }

    return {
      type,
      value,
      location: {
        start,
        end: this.getLocation()
      }
    }
  }

  throwUnexpected() {
    throw new LexerError(
      [
        null,
        `${generateCodeFrame(this.input, {
          line: this.line,
          startColumn: this.column,
          endColumn: this.column + 1
        })}`,
        `Unknown token '${this.peek()}' at ${this.line}:${this.column}`
      ].join('\n\n')
    )
  }

  reset() {
    this.index = 0
    this.line = this.column = 1
  }

  *scan(): Generator<Token> {
    const { length } = this.input

    while (this.index < length) {
      if (this.is(ARRAY_TOKENS)) {
        yield this.scanToken(TokenType.array)
      } else if (this.is(TokenChar.spreadToken)) {
        if (
          !this.is(TokenChar.spreadToken, 1) ||
          !this.is(TokenChar.spreadToken, 2)
        ) {
          this.throwUnexpected()
        }

        yield this.scanSpread()
      } else if (this.is(TokenChar.transformToken)) {
        yield this.scanToken(TokenType.transform)
      } else if (this.is(OBJECT_TOKENS)) {
        yield this.scanToken(TokenType.object)
      } else if (this.is(COUNT_TOKENS)) {
        yield this.scanToken(TokenType.count)
      } else if (this.is(COUNT_DIGIT_REGEX)) {
        const token = this.scanRegex(TokenType.countNumber, COUNT_DIGIT_REGEX)
        token.value = parseInt(token.value as string)

        yield token
      } else if (this.is(TokenChar.identifierToken)) {
        yield this.scanIdent()
      } else if (this.is(START_IDENTIFIER_REGEX)) {
        yield this.scanRegex(TokenType.identifier, IDENTIFIER_REGEX)
      } else if (this.is(LINE_CHAR)) {
        ++this.line
        ++this.index

        // Reset column
        this.column = 1
      } else if (this.is(TAB_CHAR)) {
        ++this.index
        this.column += TAB_SPACE_SIZE
      } else if (this.is(SPACE_CHAR)) {
        this.advance()
      } else if (this.is(IGNORED_CHARS)) {
        ++this.index
      } else {
        this.throwUnexpected()
      }
    }

    // Send end-of-file
    yield {
      type: TokenType.EOF,
      value: '',
      location: {
        start: this.getLocation(),
        end: this.getLocation()
      }
    }
  }
}

// Convenience method
export function scan(input: string) {
  return [...new Lexer(input).scan()]
}
