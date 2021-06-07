import '@testing-library/jest-dom/extend-expect'

process.on('unhandledRejection', err => {
    throw err
})
