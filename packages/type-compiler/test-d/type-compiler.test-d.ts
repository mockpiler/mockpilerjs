// TODO: Currently, tsd is not working with this, probably because of:
// https://github.com/microsoft/TypeScript/issues/34933

import { expectType } from 'tsd'

import type { CompileMock } from '../src'
import { input, context, ExpectedObject } from './test-cases'

const result = (null as any) as CompileMock<typeof input, typeof context>

expectType<[ExpectedObject, ExpectedObject]>(result)
