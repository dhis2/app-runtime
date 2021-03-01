import { FetchType } from './ExecuteOptions'
import { JsonValue } from './JsonValue'
import { ResolvedResourceQuery } from './Query'

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
