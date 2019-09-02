// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import analyze from 'rollup-plugin-analyzer'
import typescript from 'rollup-plugin-typescript2'

const externals = Object.keys(pkg.peerDependencies || {})

const bundle = ({ format }) => ({
    input: 'src/index.ts',
    output: {
        file: `build/${format}/index.js`,
        format,
    },
    external: externals,
    plugins: [
        resolve({ esnext: true }),
        typescript({
            typescript: require('typescript'),
            useTsconfigDeclarationDir: true,
        }),
        babel({
            extensions: ['ts', 'tsx', 'js', 'jsx'],
            exclude: /node_modules/, // only transpile our source code
        }),
        analyze({
            summaryOnly: true,
        }),
    ],
})

export default [bundle({ format: 'cjs' }), bundle({ format: 'es' })]
