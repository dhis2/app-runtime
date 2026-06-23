import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        globalSetup: './globalSetup.ts',
        testTimeout: 60_000,
        include: ['tests/**/*.test.ts'],
    },
})
