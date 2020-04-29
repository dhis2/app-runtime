import * as path from 'path'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { DataEngine } from '../src/engine/DataEngine'
import { RestAPILink } from '../src/links/RestAPILink'
import { fetchData } from '../src/links/RestAPILink/fetchData'

jest.mock('../src/links/RestAPILink/fetchData', () => ({
    fetchData: jest.fn((url, options) => Promise.resolve({ url, options })),
}))

const featurePath = path.join(__dirname, '../features/abort_mutation.feature')
const feature = loadFeature(featurePath)

defineFeature(feature, test => {
    const baseUrl = 'https://www.domain.tld'
    const apiVersion = 111

    const onComplete = jest.fn()
    const onError = jest.fn()

    afterEach(() => {
        onComplete.mockClear()
        onError.mockClear()
    })

    test('A mutation request gets cancelled', ({ given, when, then }) => {
        const controller = new AbortController()
        const link = new RestAPILink({ baseUrl, apiVersion })
        const engine = new DataEngine(link)

        given('a mutation request is pending', () => {
            const fetchFn = fetchData as jest.Mock
            fetchFn.mockImplementationOnce(
                // forever in pending state
                () => new Promise(() => null)
            )

            const query = {
                me: {
                    resource: 'me',
                    type: 'create',
                    data: {
                        foo: 'foo',
                        bar: 'bar',
                    },
                },
            }

            const options = {
                signal: controller.signal,
            }

            engine
                .query(query, options)
                .then(onComplete)
                .catch(onError)
        })

        when('the abort function is called', () => {
            controller.abort()
        })

        then('the request stops', () => {
            expect(controller.signal.aborted).toBe(true)
            expect(onComplete).toHaveBeenCalledTimes(0)
            expect(onError).toHaveBeenCalledTimes(0)
        })
    })
})
