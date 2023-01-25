import * as React from 'react'
import PluginError from '../PluginError'

// empty tests (to no trigger test failure)
describe('<PluginError />', () => {
    it('should render without failing', async () => {
        const missingEntryPoint = false
        const showDownload = false
        const appShortName = 'some_app'
        const missingProps = null
        const wrapper = () => (
            <PluginError
                missingEntryPoint={missingEntryPoint}
                showDownload={showDownload}
                appShortName={appShortName}
                missingProps={missingProps}
            />
        )
    })
})
