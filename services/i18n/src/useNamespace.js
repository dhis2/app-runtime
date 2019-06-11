import { useContext } from 'react'
import { NamespaceContext } from './NamespaceContext'

export const useNamespace = () => useContext(NamespaceContext)
