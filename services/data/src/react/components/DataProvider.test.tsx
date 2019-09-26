import React from 'react'
import { render } from '@testing-library/react'
import { DataProvider } from './DataProvider'
import { DataEngine } from '../../engine'
import { RestAPILink } from '../../links'
import { DataContext } from '../context'

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
})
