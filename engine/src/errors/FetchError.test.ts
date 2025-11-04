import { FetchError } from './FetchError'

describe('FetchError', () => {
    it('should construct successfully', () => {
        const message = 'this is a test'
        const error = new FetchError({ message, type: 'network' })

        expect(error.type).toBe('network')
        expect(error.message).toBe(message)
    })
})
