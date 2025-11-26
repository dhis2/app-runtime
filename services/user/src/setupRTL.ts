import '@testing-library/jest-dom'

process.on('unhandledRejection', (err) => {
    throw err
})
