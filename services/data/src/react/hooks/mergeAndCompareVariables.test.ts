import { mergeAndCompareVariables } from './mergeAndCompareVariables'
import { stableVariablesHash } from './stableVariablesHash'
jest.mock('./stableVariablesHash', () => ({
    stableVariablesHash: object => JSON.stringify(object),
}))

const testVariables = {
    question: 'What do you get when you multiply six by nine?',
    answer: 42,
}
const testHash = stableVariablesHash(testVariables)

describe('mergeAndCompareVariables', () => {
    it('Should return previous variables and hash when no new variables are provided', () => {
        expect(
            mergeAndCompareVariables(testVariables, undefined, undefined)
        ).toMatchObject({
            identical: true,
            mergedVariables: testVariables,
            mergedVariablesHash: undefined,
        })
    })

    it('Should return identical: true when merged variables are identical to old variables (without prev hash)', () => {
        const newVariables = { answer: testVariables.answer }

        expect(
            mergeAndCompareVariables(testVariables, newVariables, undefined)
        ).toMatchObject({
            identical: true,
            mergedVariables: testVariables,
            mergedVariablesHash: testHash,
        })
    })

    it('Should return identical: false with incorrect previous hash', () => {
        const incorrectPreviousHash = 'IAmAHash'
        const newVariables = { answer: 42 }

        expect(
            mergeAndCompareVariables(
                testVariables,
                newVariables,
                incorrectPreviousHash
            )
        ).toMatchObject({
            identical: false,
            mergedVariables: testVariables,
            mergedVariablesHash: testHash,
        })
    })

    it('Should return identical: false when merged variables are different than old variables', () => {
        const newVariables = { answer: 43 }
        const expectedMergedVariables = { ...testVariables, ...newVariables }

        expect(
            mergeAndCompareVariables(testVariables, newVariables, testHash)
        ).toMatchObject({
            identical: false,
            mergedVariables: expectedMergedVariables,
            mergedVariablesHash: stableVariablesHash(expectedMergedVariables),
        })
    })
})
