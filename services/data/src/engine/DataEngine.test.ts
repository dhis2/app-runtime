import { DataEngine } from './DataEngine'
import { DataEngineLink } from './types/DataEngineLink'
import { FetchType } from './types/ExecuteOptions'
import { Mutation } from './types/Mutation'
import { Query, ResolvedResourceQuery } from './types/Query'

const mockQuery: Query = {
    test: {
        resource: 'test',
    },
}
const mockMutation: Mutation = {
    resource: 'test',
    type: 'create',
    data: {},
}

const mockLink: DataEngineLink = {
    executeResourceQuery: jest.fn(
        async (type: FetchType, query: ResolvedResourceQuery) => {
            if (query.resource === 'ERROR') {
                throw new Error('MOCK ERROR')
            }
            return {
                type,
                resource: query.resource,
                answer: 42,
            }
        }
    ),
}

describe('DataEngine', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should construct successfully with a mock Link', () => {
        expect(() => {
            new DataEngine(mockLink)
        }).not.toThrow()
    })

    it('Should call the mock link with the passed query and options', () => {
        const controller = new AbortController()
        const engine = new DataEngine(mockLink)
        engine.query(mockQuery, {
            signal: controller.signal,
        })
        expect(mockLink.executeResourceQuery).toHaveBeenCalledWith(
            'read',
            mockQuery.test,
            {
                signal: controller.signal,
            }
        )
    })

    it('Should call the mock link with the passed mutation and options', async () => {
        const controller = new AbortController()
        const engine = new DataEngine(mockLink)
        const result = await engine.mutate(mockMutation, {
            signal: controller.signal,
        })
        expect(mockLink.executeResourceQuery).toHaveBeenCalledWith(
            mockMutation.type,
            {
                resource: mockMutation.resource,
                data: {},
            },
            {
                signal: controller.signal,
            }
        )
        expect(result).toMatchObject({
            type: mockMutation.type,
            resource: mockMutation.resource,
            answer: 42,
        })
    })

    it('Should call multilple queries in parallel', async () => {
        const engine = new DataEngine(mockLink)
        const result = await engine.query({
            test: { resource: 'test' },
            test2: { resource: 'test2' },
            test3: { resource: 'test3' },
        })
        expect(mockLink.executeResourceQuery).toHaveBeenCalledTimes(3)
        expect(result).toMatchObject({
            test: {
                type: 'read',
                resource: 'test',
                answer: 42,
            },
            test2: {
                type: 'read',
                resource: 'test2',
                answer: 42,
            },
            test3: {
                type: 'read',
                resource: 'test3',
                answer: 42,
            },
        })
    })

    it('Should call onComplete callback only once for multiple-query method', async () => {
        const options = {
            onComplete: jest.fn(),
        }
        const engine = new DataEngine(mockLink)
        await engine.query(
            {
                test: { resource: 'test' },
                test2: { resource: 'test2' },
                test3: { resource: 'test3' },
            },
            options
        )
        expect(mockLink.executeResourceQuery).toHaveBeenCalledTimes(3)
        expect(options.onComplete).toHaveBeenCalledTimes(1)
    })

    it('Should call onComplete callback only once for multiple-query method', async () => {
        const options = {
            onComplete: jest.fn(),
            onError: jest.fn(),
        }
        const engine = new DataEngine(mockLink)
        await expect(
            engine.query(
                {
                    test: { resource: 'test' },
                    test2: { resource: 'ERROR' },
                    test3: { resource: 'test3' },
                },
                options
            )
        ).rejects.toBeTruthy()
        expect(options.onComplete).toHaveBeenCalledTimes(0)
        expect(options.onError).toHaveBeenCalledTimes(1)
    })

    it('Should call onComplete callback after mutation', async () => {
        const options = {
            onComplete: jest.fn(),
        }
        const engine = new DataEngine(mockLink)
        await engine.mutate(mockMutation, options)
        expect(options.onComplete).toHaveBeenCalledTimes(1)
    })
    it('Should call onError callback after failed mutation', async () => {
        const options = {
            onComplete: jest.fn(),
            onError: jest.fn(),
        }
        const engine = new DataEngine(mockLink)
        await expect(
            engine.mutate(
                { resource: 'ERROR', type: 'delete', id: '2' },
                options
            )
        ).rejects.toBeTruthy()
        expect(options.onComplete).toHaveBeenCalledTimes(0)
        expect(options.onError).toHaveBeenCalledTimes(1)
    })
})
