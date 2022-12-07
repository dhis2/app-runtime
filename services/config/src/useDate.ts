import { useCallback, useContext, useMemo } from 'react'
import { ConfigContext } from './ConfigContext'

// extend date with extra methods
class DHIS2Date extends Date {
    serverOffset: number
    dateFormat: string
    serverTimezone: string
    clientTimezone: string

    constructor({
        date,
        serverOffset,
        dateFormat,
        serverTimezone,
        clientTimezone,
    }: {
        date: any
        serverOffset: number
        dateFormat: string
        serverTimezone: string
        clientTimezone: string
    }) {
        super(date)
        this.serverOffset = serverOffset || 0
        this.dateFormat = dateFormat
        this.serverTimezone = serverTimezone
        this.clientTimezone = clientTimezone
        Object.setPrototypeOf(this, DHIS2Date.prototype)
    }

    private _getTimeComponents(date: any) {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const days = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
        return { year, month, days, hours, minutes, seconds, milliseconds }
    }

    private _getISOString(date: any): any {
        const { year, month, days, hours, minutes, seconds, milliseconds } =
            this._getTimeComponents(date)
        return `${year}-${month}-${days}T${hours}:${minutes}:${seconds}.${milliseconds}`
    }

    public getServerISOString() {
        const serverDate = new Date(this.getTime() - this.serverOffset)
        return this._getISOString(serverDate)
    }

    public getClientISOString() {
        return this._getISOString(this)
    }
}

const useServerTimeOffset = (serverTimezone: string): number => {
    return useMemo(() => {
        const nowClientTime = new Date()
        nowClientTime.setMilliseconds(0)

        const serverLocaleString = nowClientTime.toLocaleString('sv', {
            timeZone: serverTimezone,
        })
        const nowServerTimeZone = new Date(serverLocaleString)
        nowServerTimeZone.setMilliseconds(0)

        return nowClientTime.getTime() - nowServerTimeZone.getTime()
    }, [serverTimezone])
}

export const useDate = (): {
    fromServerDate: (date: any) => any
    fromClientDate: (date: any) => any
} => {
    const { systemInfo } = useContext(ConfigContext)
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const { serverTimeZoneId: serverTimezone, dateFormat } = systemInfo || {
        serverTimeZoneId: 'Asia/Ho_Chi_Minh',
        dateFormat: 'yyyy-mm-dd',
    }

    const serverOffset = useServerTimeOffset(serverTimezone)

    const fromServerDate = useCallback(
        (date) => {
            const serverDate = new Date(date)
            const clientDate = new DHIS2Date({
                date: serverDate.getTime() + serverOffset,
                serverOffset,
                dateFormat,
                serverTimezone,
                clientTimezone,
            })

            return clientDate
        },
        [serverOffset, dateFormat, serverTimezone, clientTimezone]
    )

    const fromClientDate = useCallback(
        (date) => {
            const clientDate = new DHIS2Date({
                date,
                serverOffset,
                dateFormat,
                serverTimezone,
                clientTimezone,
            })

            return clientDate
        },
        [serverOffset, dateFormat, serverTimezone, clientTimezone]
    )

    return useMemo(
        () => ({ fromServerDate, fromClientDate }),
        [fromServerDate, fromClientDate]
    )
}
