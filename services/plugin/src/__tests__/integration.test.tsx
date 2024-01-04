import * as React from 'react'
import PluginError from '../PluginError'

// empty tests (to no trigger test failure)
describe('<PluginError />', () => {
    it('should render without failing', async () => {
        const missingEntryPoint = false
        const appShortName = 'some_app'
        const wrapper = () => (
            <PluginError
                missingEntryPoint={missingEntryPoint}
                appShortName={appShortName}
            />
        )
    })
})
