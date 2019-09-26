import { DataEngine } from '../../engine'
import { ErrorLink } from '../../links'

const errorMessage =
    'DHIS2 data context must be initialized, please ensure that you include a <DataProvider> in your application'

const link = new ErrorLink(errorMessage)
const engine = new DataEngine(link)

export const defaultContext = { engine }
