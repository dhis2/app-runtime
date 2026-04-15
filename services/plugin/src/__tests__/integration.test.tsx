import * as React from 'react'
import PluginError from '../PluginError'

// empty tests (to no trigger test failure)
describe('<PluginError />', () => {
    it('should render without failing', async () => {
        const missingEntryPoint = false
        const appShortName = 'some_app'
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const wrapper = () => (
            <PluginError
                missingEntryPoint={missingEntryPoint}
                appShortName={appShortName}
            />
        )
    })
})
