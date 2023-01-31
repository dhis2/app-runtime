import * as React from 'react'

type ErrorBoundaryState = { error: Error | null }

export class PluginErrorBoundary extends React.Component<
    {},
    ErrorBoundaryState
> {
    constructor(props: any) {
        super(props)
        this.state = {
            error: null,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log('special handling for within plugin errors would be here')
        console.error(error)
        this.setState({
            error,
        })
    }

    render() {
        if (this.state.error) {
            return <h1>this is the pluginwrapper error boundary</h1>
        }

        return this.props.children
    }
}
