import i18next from 'i18next'
import moment from 'moment'
import { defaultNamespace } from './defaultNamespace'

export const init = () => {
    i18next.init({
        resources: undefined,

        lng: 'en',
        fallbackLng: 'en',

        debug: false,
        ns: [defaultNamespace],
        defaultNS: defaultNamespace,
        fallbackNS: false,
        nsSeparator: ':',

        returnEmptyString: false,
        returnObjects: false,

        keySeparator: false,
        react: {
            wait: true,
        },
    })
}
