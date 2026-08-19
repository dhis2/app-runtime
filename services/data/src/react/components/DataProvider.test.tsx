import { ConfigProvider } from '@dhis2/app-service-config'
import type { Config } from '@dhis2/app-service-config'
import { DataEngine, RestAPILink } from '@dhis2/data-engine'
import { render } from '@testing-library/react'
import React from 'react'
import { DataContext } from '../context/DataContext'
import { DataProvider } from './DataProvider'

type ProviderProps = {
    baseUrl?: string
    apiVersion?: number
}

/*
 * Once app-platform renders the app-runtime provider, the config object is
 * stable across renders, so these helpers reuse a single config reference
 * unless a test explicitly swaps it out.
 */
const stableConfig: Config = {
    baseUrl: 'http://localhost:8080',
    apiVersion: 42,
}

const renderProvider = (
    config: Config = stableConfig,
    props: ProviderProps = {}
) => {
    const consumer = jest.fn(() => null)

    const ui = (nextConfig: Config, nextProps: ProviderProps) => (
        <ConfigProvider config={nextConfig}>
            <DataProvider {...nextProps}>
                <DataContext.Consumer>{consumer}</DataContext.Consumer>
            </DataProvider>
        </ConfigProvider>
    )

    const { rerender } = render(ui(config, props))

    return {
        rerender: (
            nextConfig: Config = config,
            nextProps: ProviderProps = props
        ) => rerender(ui(nextConfig, nextProps)),
        contexts: () => consumer.mock.calls.map((call: any) => call[0]),
        engines: () => consumer.mock.calls.map((call: any) => call[0].engine),
        latestLink: () =>
            consumer.mock.calls[consumer.mock.calls.length - 1][0].engine.link,
    }
}

const unique = (values: unknown[]) => new Set(values).size

describe('DataProvider', () => {
    it('Should pass a new engine and RestAPILink to consumers', () => {
        const renderFunction = jest.fn()
        render(
            <DataProvider baseUrl="test" apiVersion={42}>
                <DataContext.Consumer>{renderFunction}</DataContext.Consumer>
            </DataProvider>
        )

        expect(renderFunction).toHaveBeenCalled()
        const context = renderFunction.mock.calls.pop()[0]
        expect(context).not.toBeUndefined()
        expect(context.engine).toBeInstanceOf(DataEngine)
        expect(context.engine.link).toBeInstanceOf(RestAPILink)
    })

    describe('stability', () => {
        it('reuses the same engine across re-renders', () => {
            const { rerender, engines } = renderProvider()

            rerender()
            rerender()

            expect(engines()).toHaveLength(3)
            expect(unique(engines())).toBe(1)
        })

        it('reuses the same context value across re-renders', () => {
            const { rerender, contexts } = renderProvider()

            rerender()
            rerender()

            expect(contexts()).toHaveLength(3)
            expect(unique(contexts())).toBe(1)
        })

        it('reuses the same engine when the props stay equal', () => {
            const { rerender, engines } = renderProvider(stableConfig, {
                baseUrl: 'http://example.com',
                apiVersion: 39,
            })

            rerender(stableConfig, {
                baseUrl: 'http://example.com',
                apiVersion: 39,
            })

            expect(unique(engines())).toBe(1)
        })
    })

    describe('rebuilding', () => {
        it('builds a new engine when the baseUrl prop changes', () => {
            const { rerender, engines, latestLink } = renderProvider(
                stableConfig,
                { baseUrl: 'http://one.com' }
            )

            rerender(stableConfig, { baseUrl: 'http://two.com' })

            expect(unique(engines())).toBe(2)
            expect(latestLink().config.baseUrl).toBe('http://two.com')
        })

        it('builds a new engine when the apiVersion prop changes', () => {
            const { rerender, engines, latestLink } = renderProvider(
                stableConfig,
                { apiVersion: 38 }
            )

            rerender(stableConfig, { apiVersion: 39 })

            expect(unique(engines())).toBe(2)
            expect(latestLink().config.apiVersion).toBe(39)
        })

        it('builds a new engine when the config object changes', () => {
            const { rerender, engines, latestLink } = renderProvider()

            rerender({ baseUrl: 'http://elsewhere.com', apiVersion: 40 })

            expect(unique(engines())).toBe(2)
            expect(latestLink().config.baseUrl).toBe('http://elsewhere.com')
        })
    })

    describe('config resolution', () => {
        it('uses the config values when no props are supplied', () => {
            const { latestLink } = renderProvider()

            expect(latestLink().config.baseUrl).toBe('http://localhost:8080')
            expect(latestLink().config.apiVersion).toBe(42)
        })

        it('lets props take precedence over the config', () => {
            const { latestLink } = renderProvider(stableConfig, {
                baseUrl: 'http://override.com',
                apiVersion: 38,
            })

            expect(latestLink().config.baseUrl).toBe('http://override.com')
            expect(latestLink().config.apiVersion).toBe(38)
        })

        it('falls back to the config when props are explicitly undefined', () => {
            const { latestLink } = renderProvider(stableConfig, {
                baseUrl: undefined,
                apiVersion: undefined,
            })

            expect(latestLink().config.baseUrl).toBe('http://localhost:8080')
            expect(latestLink().config.apiVersion).toBe(42)
        })

        it('does not leak children into the link config', () => {
            const { latestLink } = renderProvider()

            expect(latestLink().config).not.toHaveProperty('children')
        })
    })
})
