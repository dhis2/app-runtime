// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import commonjs from 'rollup-plugin-commonjs'

const externals = Object.keys(pkg.peerDependencies || {})

const bundle = () => ({
    input: 'src/index.js',
    output: [
        {
            file: `build/es/index.js`,
            format: 'es',
        },
        {
            file: 'build/cjs/index.js',
            format: 'cjs',
        },
    ],
    external: externals,
    plugins: [
        resolve({ mainFields: ['module', 'main'] }),
        commonjs({ include: /node_modules/ }),
        babel({
            exclude: /node_modules/, // only transpile our source code
        }),
    ],
})

export default bundle()
