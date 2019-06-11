import { useNamespace } from './useNamespace'
import { useTranslation } from './useTranslation'

export const Translation = ({ options, children }) => {
    const t = useTranslation(options)
    return children(t)
}
