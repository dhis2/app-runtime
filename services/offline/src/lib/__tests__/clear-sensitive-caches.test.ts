import { openDB } from 'idb'
import 'fake-indexeddb/auto'

// const caches

it('caches exists', () => {
    expect(indexedDB).toBeDefined()
    expect(caches).toBeDefined()
})
