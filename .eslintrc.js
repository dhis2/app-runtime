const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    rules: {
        'react-hooks/exhaustive-deps': 'error',
        'import/extensions': 'off',
    },
}
