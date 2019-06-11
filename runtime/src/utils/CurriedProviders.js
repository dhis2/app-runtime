import React from 'react'
import PropTypes from 'prop-types'

export const CurriedProviders = ({ providers, children }) =>
    Providers.reduceRight(
        (acc, Provider) => <Provider>{acc}</Provider>,
        children
    )
CurriedProviders.propTypes = {
    providers: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired,
    children: PropTypes.node.isRequired,
}
