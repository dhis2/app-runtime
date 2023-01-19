import { fetchData } from './RestAPILink/fetchData'
import { RestAPILink } from '.'

jest.mock('./RestAPILink/fetchData', () => ({
    fetchData: jest.fn(async () => null),
}))

describe('RestAPILink', () => {
    it('should call fetch with the expected URL', async () => {
        const link = new RestAPILink({ baseUrl: 'http://url', apiVersion: 42 })
        await link.executeResourceQuery('read', { resource: 'something' }, {})
        expect(fetchData).toHaveBeenCalledWith('http://url/api/42/something', {
            body: undefined,
            headers: { Accept: 'application/json' },
            method: 'GET',
            signal: undefined,
        })
    })
})
