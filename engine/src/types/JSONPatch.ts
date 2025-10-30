export const JSON_PATCH_CONTENT_TYPE = 'application/json-patch+json'

export type JSONPatchOpAdd = {
    op: 'add',
    path: string,
    value: any
}

export type JSONPatchOpRemove = {
    op: 'remove',
    path: string,
}

export type JSONPatchOpReplace = {
    op: 'replace',
    path: string,
    value: any
}

export type JSONPatchOpRemoveById = {
    op: 'remove-by-id',
    path: string,
    id: string
}

export type JSONPatchOp = JSONPatchOpAdd | JSONPatchOpRemove | JSONPatchOpReplace | JSONPatchOpRemoveById

export type JSONPatch = JSONPatchOp[]