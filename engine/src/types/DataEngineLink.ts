import type { FetchType } from './ExecuteOptions'
import type { JsonValue } from './JsonValue'
import type { ResolvedResourceQuery } from './Query'

export interface DataEngineLinkExecuteOptions {
    signal?: AbortSignal
}

export interface DataEngineLink {
    executeResourceQuery: (
        type: FetchType,
        query: ResolvedResourceQuery,
        options: DataEngineLinkExecuteOptions
    ) => Promise<JsonValue>
}
