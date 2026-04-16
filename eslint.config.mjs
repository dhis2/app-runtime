import config from '@dhis2/config-eslint/react'
import { defineConfig } from 'eslint/config'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default defineConfig([
    includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    {
        extends: [config],
    },
    {
        files: ['**/*.{ts,mts,cts,tsx,js,jsx}'],

        rules: {
            'react-hooks/exhaustive-deps': 'error',
        },
    },
    {
        files: ['**/*.{ts,mts,cts,tsx}'],
        rules: {
            '@typescript-eslint/no-explicit-any': ['off'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    caughtErrors: 'none',
                    varsIgnorePattern: '^React',
                },
            ],
        },
    },
])
