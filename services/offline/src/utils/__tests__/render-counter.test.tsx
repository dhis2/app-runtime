import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { RenderCounter, resetRenderCounts } from '../render-counter'

const renderCounts = {}

export const Rerenderer = (): JSX.Element => {
    const [, setState] = React.useState(true)
    const toggleState = () => setState((prevState) => !prevState)

    return (
        <>
            <button onClick={toggleState} role="button" />
            <RenderCounter id={'rc1'} countsObj={renderCounts} />
        </>
    )
}

afterEach(() => {
    resetRenderCounts(renderCounts)
})

it('increments the counter when rerendered', () => {
    render(<Rerenderer />)

    const { getByTestId, getByRole } = screen
    expect(getByTestId('rc1')).toHaveTextContent('1')

    act(() => {
        fireEvent.click(getByRole('button'))
    })

    expect(getByTestId('rc1')).toHaveTextContent('2')

    act(() => {
        fireEvent.click(getByRole('button'))
    })

    expect(getByTestId('rc1')).toHaveTextContent('3')
})

it('resets the render counter successfully', () => {
    render(<Rerenderer />)
    expect(screen.getByTestId('rc1')).toHaveTextContent('1')
})
