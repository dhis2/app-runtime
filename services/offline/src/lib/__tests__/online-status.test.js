import { renderHook } from '@testing-library/react-hooks'
import { useOnlineStatus } from '../online-status'

beforeEach(() => {
    jest.restoreAllMocks()
})

describe('initalizes to navigator.onLine value', () => {
    it('initializes to true', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(true)
        const { result } = renderHook((...args) => useOnlineStatus(...args))

        expect(result.current.online).toBe(true)
        expect(result.current.offline).toBe(false)
    })

    it('initializes to false', () => {
        jest.spyOn(navigator, 'onLine', 'get').mockReturnValueOnce(false)
        const { result } = renderHook((...args) => useOnlineStatus(...args))

        expect(result.current.online).toBe(false)
        expect(result.current.offline).toBe(true)
    })
})

test.todo('state changes in response to browser "online" and "offline" events')

test.todo('changes are throttled')
