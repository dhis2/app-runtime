import { fetchData } from './RestAPILink/fetchData'
import { RestAPILink } from '.'

jest.mock('./RestAPILink/fetchData', () => ({
    fetchData: jest.fn(),
}))

const mockedFetchData = fetchData as jest.MockedFunction<typeof fetchData>

describe('RestAPILink', () => {
    beforeEach(() => mockedFetchData.mockReset())

    it('should call fetch with the expected URL', async () => {
        mockedFetchData.mockResolvedValue(null)
        const link = new RestAPILink({ baseUrl: 'http://url', apiVersion: 42 })
        await link.executeResourceQuery('read', { resource: 'something' }, {})
        expect(fetchData).toHaveBeenCalledWith(
            'http://url/api/42/something',
            {
                method: 'GET',
            },
            expect.objectContaining({
                config: {
                    baseUrl: 'http://url',
                    apiVersion: 42,
                },
                queryAliasCache: expect.anything(),
            })
        )
    })
    it('should limit the number of concurrent requests to 100', async () => {
        const resolvers: Array<() => void> = []
        mockedFetchData.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolvers.push(() => resolve(null))
                })
        )

        const link = new RestAPILink({ baseUrl: 'http://url', apiVersion: 42 })
        Array.from({ length: 101 }, () =>
            link.executeResourceQuery('read', { resource: 'something' }, {})
        )

        const flushPromises = () =>
            new Promise<void>((resolve) => setTimeout(resolve, 0))

        await flushPromises() // flush microtask queue so p-limit dispatches the 100 concurrent calls

        expect(fetchData).toHaveBeenCalledTimes(100)

        resolvers[0]() // resolve the first call, freeing a slot for the 101st queued request
        await flushPromises() // wait for p-limit to dispatch the 101st call

        expect(fetchData).toHaveBeenCalledTimes(101)
    })
})
