import { useNamespace } from './useNamespace'
import i18next from 'i18next'
import { useMemo } from 'react'

export const useTranslation = options => {
    const ns = useNamespace()
    const translate = useMemo(() => i18next.getFixedT(undefined, ns), [ns])
    return key => translate(key, options)
}
