import { QueryResult } from './Query'

export type Pager = {
    page: number
    total: number
    pageSize: number
    pageCount: number
    nextPage: string
}

export type PaginatedData<T> = T & { pager: Pager }

export type PaginatedQueryResult<TQueryResult extends QueryResult> = {
    [K in keyof TQueryResult]: PaginatedData<TQueryResult[K]>
}
