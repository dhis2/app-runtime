import type { QueryVariables } from '@dhis2/data-engine'
import { stableVariablesHash } from './stableVariablesHash'

export const mergeAndCompareVariables = (
    previousVariables?: QueryVariables,
    newVariables?: QueryVariables,
    previousHash?: string
) => {
    if (!newVariables) {
        return {
            identical: true,
            mergedVariablesHash: previousHash,
            mergedVariables: previousVariables,
        }
    }

    // Use cached hash if it exists
    const currentHash = previousHash || stableVariablesHash(previousVariables)

    const mergedVariables = {
        ...previousVariables,
        ...newVariables,
    }
    const mergedVariablesHash = stableVariablesHash(mergedVariables)
    const identical = currentHash === mergedVariablesHash

    return {
        identical,
        mergedVariablesHash,
        mergedVariables,
    }
}
