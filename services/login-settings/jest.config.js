module.exports = {
    collectCoverageFrom: [
        'src/**/*.(js|jsx|ts|tsx)',
        '!src/index.ts',
        '!src/**/types/*',
        '!src/**/types.ts',
    ],

    // Setup react-testing-library
    setupFilesAfterEnv: ['<rootDir>/src/setupRTL.ts'],
    // Fix for Jest 27
    // https://github.com/facebook/jest/issues/11404#issuecomment-1003328922
    testRunner: 'jest-jasmine2',
}
