import type { DataEngineConfig } from '../types/DataEngineConfig'
import type {
    DataEngineLink,
    DataEngineLinkExecuteOptions,
} from '../types/DataEngineLink'
import type { FetchType } from '../types/ExecuteOptions'
import type { ResolvedResourceQuery } from '../types/Query'
import type { JsonValue } from '../types/JsonValue'
import { fetchData } from './RestAPILink/fetchData'
import { joinPath } from './RestAPILink/path'
import { queryToRequestOptions } from './RestAPILink/queryToRequestOptions'
import { queryToResourcePath } from './RestAPILink/queryToResourcePath'

export class RestAPILink implements DataEngineLink {
    public readonly config: DataEngineConfig
    public readonly versionedApiPath: string
    public readonly unversionedApiPath: string

    public constructor(config: DataEngineConfig) {
        this.config = config
        this.versionedApiPath = joinPath('api', String(config.apiVersion))
        this.unversionedApiPath = joinPath('api')
    }

    private fetch(path: string, options: RequestInit): Promise<JsonValue> {
        return fetchData(joinPath(this.config.baseUrl, path), options)
    }

    public executeResourceQuery(
        type: FetchType,
        query: ResolvedResourceQuery,
        { signal }: DataEngineLinkExecuteOptions
    ): Promise<JsonValue> {
        return this.fetch(
            queryToResourcePath(this, query, type),
            queryToRequestOptions(type, query, signal)
        )
    }
}
