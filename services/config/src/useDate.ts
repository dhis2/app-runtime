import { useCallback, useMemo } from 'react'
import { ConfigContext } from './ConfigContext'
import { DateComponents, DateInput } from './types'
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
            super()
        }
        this.serverOffset = serverOffset
        this.serverTimezone = serverTimezone
        this.clientTimezone = clientTimezone
        Object.setPrototypeOf(this, DHIS2Date.prototype)
    }

    private _getTimeComponents(date: Date): DateComponents {
        const year = date.getFullYear().toString().padStart(4, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const days = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
        return { year, month, days, hours, minutes, seconds, milliseconds }
    }

    private _getISOString(date: Date): string {
        const { year, month, days, hours, minutes, seconds, milliseconds } =
            this._getTimeComponents(date)
        return `${year}-${month}-${days}T${hours}:${minutes}:${seconds}.${milliseconds}`
    }

    public getServerISOString(): string {
        const serverDate = new Date(this.getTime() - this.serverOffset)
        return this._getISOString(serverDate)
    }

    public getClientISOString(): string {
        return this._getISOString(this)
    }
}

const useServerTimeOffset = (serverTimezone: string): number => {
    return useMemo(() => {
        try {
            const nowClientTime = new Date()
            nowClientTime.setMilliseconds(0)

            // 'sv' is used for localeString because it is the closest to ISO format
            // in principle, any locale should be parsable back to a date, but we encountered an error
            // when using en-US in certain environments, which we could not replicate when using 'sv'
            // Converting to localeString and then back to date is unfortunately the only current way
            // to construct a date that accounts for timezone.
            const serverLocaleString = nowClientTime.toLocaleString('sv', {
                timeZone: serverTimezone,
            })
            const nowServerTimeZone = new Date(serverLocaleString)
            nowServerTimeZone.setMilliseconds(0)

            return nowClientTime.getTime() - nowServerTimeZone.getTime()
        } catch (err) {
            console.error(
                'Server time offset could not be determined; assuming no client/server difference',
                err
            )
            // if date is not constructable with timezone, assume 0 difference between client/server
            return 0
        }
    }, [serverTimezone])
}

export const useDate = (): {
    fromServerDate: (date?: DateInput) => DHIS2Date
    fromClientDate: (date?: DateInput) => DHIS2Date
} => {
    const { systemInfo } = useConfig()
    let serverTimezone: string
    const clientTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    if (systemInfo?.serverTimeZoneId) {
        serverTimezone = systemInfo.serverTimeZoneId
    } else {
        // Fallback to client timezone
        serverTimezone = clientTimezone
        console.warn('No server timezone ID found, falling back to client timezone. This could cause date conversion issues.')
    }

    const serverOffset = useServerTimeOffset(serverTimezone)

    const fromServerDate = useCallback(
        (date) => {
            const serverDate = new Date(date)
            const clientDate = new DHIS2Date({
                date: serverDate.getTime() + serverOffset,
                serverOffset,
                serverTimezone,
                clientTimezone,
            })

            return clientDate
        },
        [serverOffset, serverTimezone, clientTimezone]
    )

    const fromClientDate = useCallback(
        (date) => {
            const clientDate = new DHIS2Date({
                date,
                serverOffset,
                serverTimezone,
                clientTimezone,
            })

            return clientDate
        },
        [serverOffset, serverTimezone, clientTimezone]
    )

    return useMemo(
        () => ({ fromServerDate, fromClientDate }),
        [fromServerDate, fromClientDate]
    )
}
