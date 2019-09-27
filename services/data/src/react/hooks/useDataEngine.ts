import { useContext } from 'react'
import { DataContext } from '../context/DataContext'

export const useDataEngine = () => {
    const context = useContext(DataContext)

    return context.engine
}
