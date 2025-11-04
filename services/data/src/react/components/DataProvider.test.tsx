import { DataEngine, RestAPILink } from '@dhis2/data-engine'
import { render } from '@testing-library/react'
import React from 'react'
import { DataContext } from '../context/DataContext'
import { DataProvider } from './DataProvider'

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
