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
            queryToResourcePath(this.apiPath, query, type),
            queryToRequestOptions({
                type,
                query,
                apiVersion: this.apiVersion,
                signal,
            })
        )
    }
}
