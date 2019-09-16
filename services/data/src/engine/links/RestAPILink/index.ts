import { queryToResourcePath } from './helpers/queryToResourcePath'
import { queryToRequestOptions } from './helpers/queryToRequestOptions'
import { ResolvedResourceQuery } from '../../types/Query'
import { FetchType } from '../../types/ExecuteOptions'
import { JsonValue } from '../../types/JsonValue'
import {
    DataEngineLink,
    DataEngineLinkExecuteOptions,
} from '../../types/DataEngineLink'
import { joinPath } from './helpers/path'
import { fetchData } from './helpers/networkFetch'

export interface RestAPILinkInput {
    baseUrl: string
    apiVersion: number
}

export class RestAPILink implements DataEngineLink {
    private apiPath: string
    private baseUrl: string
    private apiVersion: number

    public constructor({ baseUrl, apiVersion }: RestAPILinkInput) {
        this.baseUrl = baseUrl
        this.apiVersion = apiVersion
        this.apiPath = joinPath('api', String(apiVersion))
    }

    private fetch(path: string, options: RequestInit): Promise<JsonValue> {
        return fetchData(joinPath(this.baseUrl, path), options)
    }

    public executeResourceQuery(
        type: FetchType,
        query: ResolvedResourceQuery,
        { signal }: DataEngineLinkExecuteOptions
    ): Promise<JsonValue> {
        return this.fetch(
            queryToResourcePath(this.apiPath, query),
            queryToRequestOptions(type, query, signal)
        )
    }
}
