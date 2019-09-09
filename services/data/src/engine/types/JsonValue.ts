export type JsonValue = boolean | number | string | null | JsonArray | JsonMap
export interface JsonMap {
    [key: string]: JsonValue
}
/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface JsonArray extends Array<JsonValue> {}

// export type JsonValue = any
