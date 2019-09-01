import { ContextType, FetchFunction } from '../types/Context'

const errorMessage =
    'DHIS2 data context must be initialized, please ensure that you include a <DataProvider> in your application'
const uninitializedFetch: FetchFunction = async () => {
    console.error(errorMessage)
    throw new Error(errorMessage)
}

export const defaultContext: ContextType = {
    baseUrl: '',
    apiVersion: 0,
    apiUrl: '',
    fetch: uninitializedFetch,
}
