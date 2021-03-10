module.exports = {
    collectCoverageFrom: [
        'src/**/*.(js|jsx|ts|tsx)',
        '!src/index.ts',
        '!src/**/types/*',
        '!src/**/types.ts',
        '!src/engine/index.ts',
        '!src/links/index.ts',
        '!src/react/index.ts',
    ],

    // Setup react-testing-library
    setupFilesAfterEnv: ['<rootDir>/src/setupRTL.ts'],
}
