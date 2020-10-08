import { contentTypeForResource } from './contentTypeForResource'

describe('contentTypeForResource', () => {
    it('returns text/plain for a string match', () => {
        expect(contentTypeForResource('messageConversations/feedback')).toMatch(
            'text/plain'
        )
    })
    it('returns text/plain for a regex match', () => {
        expect(
            contentTypeForResource('messageConversations/g8mcplgksV2/priority')
        ).toMatch('text/plain')
    })
    it('returns application/json for non-matches', () => {
        expect(contentTypeForResource('nothing/to/match')).toMatch(
            'application/json'
        )
    })
})
