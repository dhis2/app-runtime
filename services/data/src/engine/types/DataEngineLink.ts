import { FetchType } from './ExecuteOptions'
import { ResolvedResourceQuery } from './Query'
import { JsonValue } from './JsonValue'

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
