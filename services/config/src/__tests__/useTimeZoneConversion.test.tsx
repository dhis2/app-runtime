import { renderHook } from '@testing-library/react-hooks'
import React, { ReactNode } from 'react'
import { ConfigProvider, useTimeZoneConversion } from '../index'

const defaultConfig = { baseUrl: '/', apiVersion: 40 }
const defaultSystemInfo = {
    version: '40',
    contextPath: '',
    serverTimeZoneId: 'UTC',
}

// tests are set to run at UTC when running yarn test

describe('useTimeZoneConversion', () => {
    it('Hook returns a fromClientDate and fromServerDate function', () => {
        const config = { baseUrl: '/', apiVersion: 30 }
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConfigProvider config={config}>{children}</ConfigProvider>
        )
        const { result } = renderHook(() => useTimeZoneConversion(), { wrapper })

        expect(result.current).toHaveProperty('fromClientDate')
        expect(typeof result.current.fromClientDate).toBe('function')
        expect(result.current).toHaveProperty('fromServerDate')
        expect(typeof result.current.fromServerDate).toBe('function')
    })

    it('returns fromServerDate that corrects for server time zone', () => {
        const systemInfo = {
            ...defaultSystemInfo,
            serverTimeZoneId: 'Europe/Oslo',
        }
        const config = { ...defaultConfig, systemInfo }
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConfigProvider config={config}>{children}</ConfigProvider>
        )
        const { result } = renderHook(() => useTimeZoneConversion(), { wrapper })

        const serverDate = result.current.fromServerDate('2010-01-01')
        const expectedDateString = '2009-12-31T23:00:00.000'
        expect(serverDate.getClientZonedISOString()).toBe(expectedDateString)
    })

    // fromServerDate accepts number, valid date string, or date object
    it('returns fromServerDate which accepts number, valid date string, or date object', () => {
        const config = { ...defaultConfig, systemInfo: defaultSystemInfo }
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConfigProvider config={config}>{children}</ConfigProvider>
        )
        const { result } = renderHook(() => useTimeZoneConversion(), { wrapper })

        const dateString = '2010-01-01'
        const dateFromString = new Date('2010-01-01')
        const millisecondsAfterUTC = dateFromString.getTime()

        const serverDateFromString = result.current.fromServerDate(dateString)
        const serverDateFromDate = result.current.fromServerDate(dateFromString)
        const serverDateFromNumber =
            result.current.fromServerDate(millisecondsAfterUTC)

        expect(serverDateFromString).toEqual(serverDateFromDate)
        expect(serverDateFromString).toEqual(serverDateFromNumber)
    })

    // returns current (client) date if no argument is provided
    // it('returns fromServerDate which returns an invalid date if ', () => {
    //     const config = {...defaultConfig,systemInfo: defaultSystemInfo}
    //     const wrapper = ({ children }: { children?: ReactNode }) => (
    //         <ConfigProvider config={config}>{children}</ConfigProvider>
    //     )
    //     const { result } = renderHook(() => useTimeZoneConversion(), {wrapper})

    //     const now = result.current.fromServerDate()
    //     const nowDirect = new Date()

    //     expect(nowDirect.getTime()-now.getTime()).toBeLessThan(1000)
    // })

    // fromServerDate defaults to client time zone if invalid server time zone provided
    it('returns fromServerDate that assumes no time zone difference if provided time zone is invalid', () => {
        const systemInfo = {
            ...defaultSystemInfo,
            serverTimeZoneId: 'Asia/Oslo',
        }
        const config = { ...defaultConfig, systemInfo }
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConfigProvider config={config}>{children}</ConfigProvider>
        )
        const { result } = renderHook(() => useTimeZoneConversion(), { wrapper })

        const serverDate = result.current.fromServerDate('2010-01-01')
        const expectedDateString = '2010-01-01T00:00:00.000'
        expect(serverDate.getClientZonedISOString()).toBe(expectedDateString)
    })

    it('returns fromServerDate with server date that matches passed time regardless of timezone', () => {
        const systemInfo = {
            ...defaultSystemInfo,
            serverTimeZoneId: 'Asia/Jakarta',
        }
        const config = { ...defaultConfig, systemInfo }
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConfigProvider config={config}>{children}</ConfigProvider>
        )
        const { result } = renderHook(() => useTimeZoneConversion(), { wrapper })

        const serverDate = result.current.fromServerDate('2015-03-03T12:00:00')
        const expectedDateString = '2015-03-03T12:00:00.000'
        expect(serverDate.getServerZonedISOString()).toBe(expectedDateString)
    })

    it('returns fromClientDate that reflects client time but makes server time string accessible', () => {
        const systemInfo = {
            ...defaultSystemInfo,
            serverTimeZoneId: 'America/Guatemala',
        }
        const config = { ...defaultConfig, systemInfo }
        const wrapper = ({ children }: { children?: ReactNode }) => (
            <ConfigProvider config={config}>{children}</ConfigProvider>
        )
        const { result } = renderHook(() => useTimeZoneConversion(), { wrapper })

        const serverDate = result.current.fromClientDate('2018-08-15T12:00:00')
        const expectedClientDateString = '2018-08-15T12:00:00.000'
        const expectedServerDateString = '2018-08-15T06:00:00.000'
        const javascriptDate = new Date('2018-08-15T12:00:00')
        expect(serverDate.getClientZonedISOString()).toBe(expectedClientDateString)
        expect(serverDate.getServerZonedISOString()).toBe(expectedServerDateString)
        expect(serverDate.getTime()).toEqual(javascriptDate.getTime())
    })
})
