import { Token } from '@mockpiler/lexer'

export enum AstNodeType {
  Root = 'Root',
  Identifier = 'Identifier',
  Spread = 'Spread',
  Transform = 'Tranform',
  Object = 'Object',
  Array = 'Array',
  Property = 'Property',
  Element = 'Element'
}

export interface AstNode {
  type: AstNodeType
  location: Token['location']
}

export interface AstPropertyNode extends AstNode {
  type: AstNodeType.Property
  key: AstIdentifierNode
  value: AstValueNode
}

export interface AstIdentifierNode extends AstNode {
  type: AstNodeType.Identifier
  name: string
}

export interface AstArrayNode extends AstNode {
  type: AstNodeType.Array
  elements: Array<AstSpreadNode | AstElementNode>
}

export interface AstElementNode extends AstNode {
  type: AstNodeType.Element
  count: number | AstIdentifierNode
  value: AstValueNode
}

export interface AstObjectNode extends AstNode {
  type: AstNodeType.Object
  properties: Array<AstSpreadNode | AstPropertyNode>
}

export interface AstRootNode extends AstNode {
  type: AstNodeType.Root
  value: AstObjectOrArrayNode
}

export interface AstSpreadNode extends AstNode {
  type: AstNodeType.Spread
  identifier: AstIdentifierNode
}

export interface AstTransformNode extends AstNode {
  type: AstNodeType.Transform
  transformer: AstIdentifierNode
  value: AstValueNode
}

export type AstObjectOrArrayNode = AstObjectNode | AstArrayNode

export type AstValueNode =
  | AstObjectOrArrayNode
  | AstIdentifierNode
  | AstTransformNode
