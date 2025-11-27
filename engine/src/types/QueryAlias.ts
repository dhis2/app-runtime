import type { LRUCache } from "../helpers/LRUCache"

export type QueryAlias = {
    id: string,
    path: string,
    href: string,
    target: string
}

export type QueryAliasCache = LRUCache<string, QueryAlias>