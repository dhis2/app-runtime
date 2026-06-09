type QueryParameterSingularValue = string | number | boolean
interface QueryParameterAliasedValue {
    [name: string]: QueryParameterSingularValue
}
type QueryParameterSingularOrAliasedValue =
    | QueryParameterSingularValue
    | QueryParameterAliasedValue

type QueryParameterMultipleValue = QueryParameterSingularOrAliasedValue[]

export type QueryParameterValue =
    | QueryParameterSingularValue
    | QueryParameterAliasedValue
    | QueryParameterMultipleValue
    | undefined

export interface QueryParameters {
    pageSize?: number
    // Allow readonly string arrays (e.g. `["id", "name"] as const`) so callers can
    // declare fields as a const tuple for type inference without a type cast.
    fields?: string | readonly string[]
    [key: string]: QueryParameterValue | readonly string[]
}
