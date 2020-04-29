module.exports = {
    roots: ['<rootDir>/test'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    collectCoverageFrom: ['src/**/*.(js|jsx|ts|tsx)', '!src/index.ts'],

    // Setup react-testing-library
    setupFilesAfterEnv: ['<rootDir>/src/setupRTL.ts'],
}
