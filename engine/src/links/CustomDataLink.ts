import type {
    DataEngineLink,
    DataEngineLinkExecuteOptions,
} from '../types/DataEngineLink'
import type { FetchType } from '../types/ExecuteOptions'
import type { JsonValue } from '../types/JsonValue'
import type { ResolvedResourceQuery } from '../types/Query'

export type CustomResourceFactory = (
    type: FetchType,
    query: ResolvedResourceQuery,
    options?: DataEngineLinkExecuteOptions
) => Promise<JsonValue | undefined>
export type CustomResource = JsonValue | CustomResourceFactory
export interface CustomData {
    [resourceName: string]: CustomResource
}
export interface CustomLinkOptions {
    loadForever?: boolean
    failOnMiss?: boolean
}

export class CustomDataLink implements DataEngineLink {
    private readonly failOnMiss: boolean
    private readonly loadForever: boolean
    private readonly data: CustomData
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
            return new Promise<JsonValue>(() => undefined)
        }

        const customResource = this.data[query.resource]
        if (customResource === undefined) {
            if (this.failOnMiss) {
                throw new Error(
                    `No data provided for resource type ${query.resource}!`
                )
            }
            return null
        }

        switch (typeof customResource) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'object':
                return customResource
            case 'function': {
                const result = await customResource(type, query, options)
                if (result === undefined && this.failOnMiss) {
                    throw new Error(
                        `The custom function for resource ${query.resource} must always return a value but returned ${result}`
                    )
                }
                return result || null
            }
        }
    }
}
