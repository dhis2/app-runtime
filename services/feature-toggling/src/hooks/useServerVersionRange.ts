import { useContext } from 'react'
import { ServerVersionRangeContext } from '../context/ServerVersionRangeContext'

export const useServerVersionRange = () => useContext(ServerVersionRangeContext)
