import {
  contextualizeTemplate,
  MockContextInput,
  MockContext,
  unknownIdent
} from '@mockpiler/context'
import {
  AstRootNode,
  AstNodeType,
  AstArrayNode,
  AstSpreadNode,
  AstElementNode,
  AstObjectNode,
  AstValueNode,
  AstIdentifierNode,
  AstTransformNode,
  parse
} from '@mockpiler/parser'
import { scan } from '@mockpiler/lexer'
import { TransformFn } from '@mockpiler/transform'

import { CompileMockArgs, CompileMockFn } from './types'

export class CompilerError extends Error {
  name = 'CompilerError'
}

const EMPTY_CONTEXT = Object.create(null)

export function createCompiler(
  contextOrAccessor: MockContextInput
): CompileMockFn
export function createCompiler(
  ...args: Parameters<CompileMockFn>
): ReturnType<CompileMockFn>
export function createCompiler(
  input: MockContextInput | TemplateStringsArray,
  ...values: any[]
) {
  return Array.isArray(input) && input.hasOwnProperty('raw')
    ? compileMockWithContext(input as any, values, EMPTY_CONTEXT)
    : (...[templateStrings, ...values]: CompileMockArgs) =>
        compileMockWithContext(templateStrings, values, input)

  function compileMockWithContext(
    templateStrings: TemplateStringsArray,
    values: any[],
    contextOrAccessor: MockContextInput
  ) {
    const { template, context } = contextualizeTemplate(
      templateStrings,
      values,
      contextOrAccessor
    )

    return compileMock(template, context)
  }
}

export class Compiler {
  constructor(public rootNode: AstRootNode, public context: MockContext) {}

  compile() {
    return this.compileRoot(this.rootNode)
  }

  compileRoot({ value }: AstRootNode): any {
    return value.type === AstNodeType.Array
      ? this.compileArray(value)
      : this.compileObject(value)
  }

  compileArray(node: AstArrayNode): any[] {
    const result: any[] = []

    for (const element of node.elements) {
      if (element.type === AstNodeType.Spread) {
        this.compileElementSpread(element, result)
      } else {
        this.compileElement(element, result)
      }
    }

    return result
  }

  compileElementSpread(node: AstSpreadNode, parent: any[]) {
    parent.push(...this.compileIdent(node.identifier))
  }

  compileElement(node: AstElementNode, parent: any[]) {
    let count =
      typeof node.count !== 'number'
        ? this.compileIdent(node.count)
        : node.count

    while (count--) {
      parent.push(this.compileValue(node.value))
    }
  }

  compileObject(node: AstObjectNode): Record<string, any> {
    const result: Record<string, any> = {}

    for (const property of node.properties) {
      if (property.type === AstNodeType.Spread) {
        this.compilePropertySpread(property, result)
      } else {
        result[property.key.name] = this.compileValue(property.value)
      }
    }

    return result
  }

  compilePropertySpread(node: AstSpreadNode, parent: object) {
    const result = this.compileIdent(node.identifier)

    Object.assign(parent, result)
  }

  compileValue(node: AstValueNode): any {
    switch (node.type) {
      case AstNodeType.Array: {
        return this.compileArray(node)
      }

      case AstNodeType.Object: {
        return this.compileObject(node)
      }

      case AstNodeType.Identifier: {
        return this.compileIdent(node)
      }

      case AstNodeType.Transform: {
        return this.compileTransform(node)
      }
    }
  }

  compileIdent({ name }: AstIdentifierNode, shouldCompileFn = true) {
    const value = this.context[name]

    if (value === unknownIdent) {
      throw new CompilerError(`Unknown context identifier: ${name}`)
    }

    return typeof value === 'function' && shouldCompileFn
      ? value.call(this.context)
      : value
  }

  compileTransform(node: AstTransformNode) {
    const transformFn: TransformFn = this.compileIdent(node.transformer, false)
    const value = this.compileValue(node.value)

    return transformFn(value)
  }
}

export function compileMock(input: string, context: MockContext) {
  return new Compiler(parse(input), context).compile()
}
