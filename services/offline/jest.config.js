module.exports = {
    collectCoverageFrom: [
        'src/**/*.(js|jsx|ts|tsx)',
        '!src/index.ts',
        '!src/**/types/*',
        '!src/**/types.ts',
    ],

    // Setup react-testing-library
    setupFilesAfterEnv: ['<rootDir>/src/setupRTL.ts'],
}
