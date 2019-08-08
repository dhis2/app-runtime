module.exports = function(api) {
    api.cache.forever()

    const presets = ['@babel/preset-react', ['@babel/preset-typescript']]

    if (process.env.BABEL_ENV === 'commonjs') {
        presets.push([
            '@babel/preset-env',
            {
                modules: 'commonjs',
            },
        ])
    }

    return {
        presets,
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
        ],
        env: {
            test: {
                plugins: ['@babel/plugin-transform-runtime'],
            },
        },
    }
}
