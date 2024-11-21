import { renderHook, act } from '@testing-library/react'
import { useStaticInput } from './useStaticInput'

describe('useStaticInput', () => {
    const originalWarn = console.warn
    const mockWarn = jest.fn()
    beforeEach(() => {
        jest.clearAllMocks()
        console.warn = mockWarn
    })
    afterEach(() => (console.warn = originalWarn))

    it('Should pass without warnings on first render', () => {
        const { result } = renderHook(() => useStaticInput(42))
        expect(result.current[0]).toBe(42)
        expect(mockWarn).not.toHaveBeenCalled()
    })

    it('Should refuse update on updated render', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useStaticInput(value),
            { initialProps: { value: 42 } }
        )
        expect(result.current[0]).toBe(42)
        rerender({ value: 54 })
        expect(mockWarn).not.toHaveBeenCalled()
        expect(result.current[0]).toBe(42)
    })

    it('Should show a warning on updated render (with warn prop)', () => {
        const { result, rerender } = renderHook(
            ({ value }) => useStaticInput(value, { warn: true }),
            { initialProps: { value: 42 } }
        )
        expect(result.current[0]).toBe(42)
        rerender({ value: 54 })
        expect(mockWarn).toHaveBeenCalled()
        expect(mockWarn.mock.calls.pop()).toMatchInlineSnapshot(`
            Array [
              "The input should be static, don't create it within the render loop!",
            ]
        `)
        expect(result.current[0]).toBe(42)
    })

    it('Should show custom name in warning if supplied', () => {
        const { result, rerender } = renderHook(
            ({ value }) =>
                useStaticInput(value, { warn: true, name: 'TESTING THING' }),
            { initialProps: { value: 42 } }
        )
        expect(result.current[0]).toBe(42)
        rerender({ value: 54 })
        expect(mockWarn).toHaveBeenCalled()
        expect(mockWarn.mock.calls.pop()[0]).toMatch(/TESTING THING/g)
        expect(result.current[0]).toBe(42)
    })

    it('Should update when explicitly set to update', async () => {
        const { result, rerender } = renderHook(
            ({ value }) => useStaticInput(value, { warn: true }),
            {
                initialProps: { value: 42 },
            }
        )
        const [value, setValue] = result.current
        expect(value).toBe(42)

        act(() => {
            setValue(54)
        })

        expect(result.current[0]).toBe(54)
        expect(mockWarn).not.toHaveBeenCalled()

        rerender({ value: 54 })
        expect(result.current[0]).toBe(54)
        expect(mockWarn).toHaveBeenCalled()

        rerender({ value: 75 })
        expect(result.current[0]).toBe(54)
        expect(mockWarn).toHaveBeenCalledTimes(2)
    })

    it('Should support functional values', () => {
        const fn = jest.fn()
        const fn2 = jest.fn()
        const { result, rerender } = renderHook(
            ({ value }) => useStaticInput(value, { warn: true }),
            {
                initialProps: { value: fn },
            }
        )
        expect(fn).not.toHaveBeenCalled()
        expect(result.current[0]).toBe(fn)
        result.current[0]()
        expect(fn).toHaveBeenCalled()
        rerender({ value: fn2 })
        expect(result.current[0]).toBe(fn)
    })
})
