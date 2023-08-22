import type { Config } from '@dhis2/app-service-config'
import {
    DataEngineLink,
    DataEngineLinkExecuteOptions,
    FetchType,
    JsonValue,
    ResolvedResourceQuery,
} from '../engine/'
import { fetchData } from './RestAPILink/fetchData'
import { joinPath } from './RestAPILink/path'
import { queryToRequestOptions } from './RestAPILink/queryToRequestOptions'
import { queryToResourcePath } from './RestAPILink/queryToResourcePath'

export class RestAPILink implements DataEngineLink {
    public readonly config: Config
    public readonly versionedApiPath: string
    public readonly unversionedApiPath: string

    public constructor(config: Config) {
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
