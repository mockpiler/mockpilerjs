export type CompileMockArgs = Parameters<typeof String['raw']>
export type CompileMockFn = (...args: CompileMockArgs) => any
