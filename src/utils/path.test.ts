import { joinPath } from './path'

describe('Utils', () => {
    describe('pathJoin', () => {
        it('Should strip all leading and trailing slashes', () => {
            expect(joinPath('///test//')).toBe('test')
        })
        it('Should join path segments with slashes', () => {
            expect(joinPath('a', 'b', 'c', 'd')).toBe('a/b/c/d')
        })
        it('Should only include singular joining slashes', () => {
            expect(joinPath('//a/', 'b//', '///c////', '/d')).toBe('a/b/c/d')
        })
    })
})
