import { useContext } from 'react'
import { DataContext } from '../context'

export const useDataEngine = () => {
    const context = useContext(DataContext)

    return context.engine
}
