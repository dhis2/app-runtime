import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'

process.on('unhandledRejection', err => {
    throw err
})
