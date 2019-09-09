import { ResolvedResourceQuery } from '../types/Query'
import {
    DataEngineLinkExecuteOptions,
    DataEngineLink,
} from '../types/DataEngineLink'
import { JsonValue } from '../types/JsonValue'
import { FetchType } from '../types/ExecuteOptions'

export type CustomResourceFactory = (
    type: FetchType,
    query: ResolvedResourceQuery,
    options?: DataEngineLinkExecuteOptions
) => Promise<JsonValue>
export type CustomResource = JsonValue | CustomResourceFactory
export interface CustomData {
    [resourceName: string]: CustomResource
}
export interface CustomLinkOptions {
    loadForever?: boolean
    failOnMiss?: boolean
}

export class CustomDataLink implements DataEngineLink {
    private failOnMiss: boolean
    private loadForever: boolean
    private data: CustomData
    public constructor(
        customData: CustomData,
        { failOnMiss = true, loadForever = false }: CustomLinkOptions = {}
    ) {
        this.data = customData
        this.failOnMiss = failOnMiss
        this.loadForever = loadForever
    }

    public async executeResourceQuery(
        type: FetchType,
        query: ResolvedResourceQuery,
        options: DataEngineLinkExecuteOptions
    ) {
        if (this.loadForever) {
            return new Promise<JsonValue>(() => {})
        }

        const customResource = this.data[query.resource]
        if (!customResource) {
            if (this.failOnMiss) {
                throw new Error(
                    `No data provided for resource type ${query.resource}!`
                )
            }
            return Promise.resolve(null)
        }

        switch (typeof customResource) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'object':
                return customResource
            case 'function':
                try {
                    const result = await customResource(type, query, options)
                    if (!result && this.failOnMiss) {
                        throw new Error(
                            `The custom function for resource ${query.resource} must always return a value but returned ${result}`
                        )
                    }
                    return result || {}
                } catch (e) {
                    throw e
                }
            default:
                // should be unreachable
                throw new Error(
                    `Unknown resource type ${typeof customResource}`
                )
        }
    }
}
