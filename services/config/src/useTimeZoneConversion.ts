import { useCallback, useMemo } from 'react'
import { DateInput } from './types'
import { useConfig } from './useConfig'

// extend date with extra methods
class DHIS2Date extends Date {
    serverOffset: number
    serverTimezone: string
    clientTimezone: string

    constructor({
        date,
        serverOffset,
        serverTimezone,
        clientTimezone,
    }: {
        date: DateInput
        serverOffset: number
        serverTimezone: string
        clientTimezone: string
    }) {
        if (date) {
            super(date)
        } else {
            super(Date.now())
        }
        this.serverOffset = serverOffset
        this.serverTimezone = serverTimezone
        this.clientTimezone = clientTimezone
    }

    private _getISOString(date: Date): string {
        const year = date.getFullYear().toString().padStart(4, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const days = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
        return `${year}-${month}-${days}T${hours}:${minutes}:${seconds}.${milliseconds}`
    }

    public getServerZonedISOString(): string {
        const serverDate = new Date(this.getTime() - this.serverOffset)
        return this._getISOString(serverDate)
    }

    public getClientZonedISOString(): string {
        return this._getISOString(this)
    }
}

const calculateOffset = (inputDate: any, serverTimezone: string) => {
    // we need to assume that the inputDate is in the client time zone due to limitations of javascript logic
    // note that this assumption is will be imperfect around daylight savings time changes
    const thenClientTime = new Date(inputDate)
    thenClientTime.setMilliseconds(0)

    // 'sv' is used for localeString because it is the closest to ISO format
    // in principle, any locale should be parsable back to a date, but we encountered an error
    // when using en-US in certain environments, which we could not replicate when using 'sv'
    // Converting to localeString and then back to date is unfortunately the only current way
    // to construct a date that accounts for timezone.
    const serverLocaleString = thenClientTime.toLocaleString('sv', {
        timeZone: serverTimezone,
    })

    const thenServerTimeZone = new Date(serverLocaleString)

    return thenClientTime.getTime() - thenServerTimeZone.getTime()
}

/**
 * Determines if the server/client time zone offset can and should be calculated
 * @param {string} serverTimezone string representation of server time zone (Area/Location)
 * * @param {string} clientTimezone string representation of client time zone (Area/Location)
 * @return {boolean} shouldCalculateOffset
 */

const useShouldCalculateOffset = (
    serverTimezone: string,
    clientTimezone: string
): boolean => {
    return useMemo(() => {
        // if client and server time zones are the same, offset is 0 and does not need to be subsequently calculated
        if (serverTimezone === clientTimezone) {
            return false
        }
        // attempt to calculate current time zone offset, if calcublable: return true; if not calculable, alert and return false
        try {
            const nowClientTime = new Date()
            calculateOffset(nowClientTime, serverTimezone)
            return true
        } catch (err) {
            console.error(
                'Server time offset could not be determined; assuming no client/server difference',
                err
            )
            // if date is not constructable with timezone, assume 0 difference between client/server
            return false
        }
    }, [serverTimezone, clientTimezone])
}

export const useTimeZoneConversion = (): {
    fromServerDate: (date?: DateInput) => DHIS2Date
    fromClientDate: (date?: DateInput) => DHIS2Date
} => {
    const { systemInfo } = useConfig()

    let serverTimezone: string
    const clientTimezone: string =
        Intl.DateTimeFormat().resolvedOptions().timeZone

    if (systemInfo?.serverTimeZoneId) {
        serverTimezone = systemInfo.serverTimeZoneId
    } else {
        // Fallback to client timezone
        serverTimezone = clientTimezone
        console.warn(
            'No server timezone ID found, falling back to client timezone. This could cause date conversion issues.'
        )
    }

    const shouldCalculateOffset = useShouldCalculateOffset(
        serverTimezone,
        clientTimezone
    )

    const fromServerDate = useCallback(
        (date) => {
            const jsServerDate = date ? new Date(date) : new Date(Date.now())
            const offset = shouldCalculateOffset
                ? calculateOffset(jsServerDate, serverTimezone)
                : 0
            const clientDate = new DHIS2Date({
                date: jsServerDate.getTime() + offset,
                serverOffset: offset,
                serverTimezone,
                clientTimezone,
            })

            return clientDate
        },
        [shouldCalculateOffset, serverTimezone, clientTimezone]
    )

    const fromClientDate = useCallback(
        (date) => {
            const jsClientDate = date ? new Date(date) : new Date(Date.now())
            const offset = shouldCalculateOffset
                ? calculateOffset(jsClientDate, serverTimezone)
                : 0
            const clientDate = new DHIS2Date({
                date,
                serverOffset: offset,
                serverTimezone,
                clientTimezone,
            })

            return clientDate
        },
        [shouldCalculateOffset, serverTimezone, clientTimezone]
    )

    return useMemo(
        () => ({ fromServerDate, fromClientDate }),
        [fromServerDate, fromClientDate]
    )
}
