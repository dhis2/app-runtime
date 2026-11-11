import { DataEngine, RestAPILink } from '@dhis2/data-engine'
import {
    apiBase,
    apiToken,
    apiVersion,
    adminBasicAuth,
    baseUrl,
    describeOrSkip,
} from './helpers'

interface CreatedToken {
    uid: string
    key: string
}

async function createPat(label: string): Promise<CreatedToken> {
    const res = await fetch(`${apiBase}/apiToken`, {
        method: 'POST',
        headers: {
            Authorization: adminBasicAuth,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ type: 'PERSONAL_ACCESS_TOKEN_V2', name: label }),
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`POST /apiToken failed ${res.status}: ${body}`)
    }

    const body = await res.json()
    const key: string =
        body.response?.key ?? body.key ?? body.token ?? body.apiToken
    const uid: string = body.response?.uid ?? body.uid ?? body.id

    if (!key || !uid) {
        throw new Error(
            `Unexpected apiToken response shape: ${JSON.stringify(body)}`
        )
    }

    return { uid, key }
}

async function deletePat(uid: string): Promise<void> {
    await fetch(`${apiBase}/apiToken/${uid}`, {
        method: 'DELETE',
        headers: { Authorization: adminBasicAuth },
    })
}

describeOrSkip('Personal Access Token — integration', () => {
    it('creates a PAT via the API and uses it to authenticate DataEngine queries', async () => {
        const token = await createPat('app-runtime-integration-test')

        try {
            const engine = new DataEngine(
                new RestAPILink({ baseUrl, apiVersion, apiToken: token.key })
            )

            const result: any = await engine.query({
                me: { resource: 'me', params: { fields: 'id,username' } },
            })

            expect(typeof result.me.id).toBe('string')
            expect(typeof result.me.username).toBe('string')
        } finally {
            await deletePat(token.uid)
        }
    })

    it('rejects requests made with a deleted PAT', async () => {
        const token = await createPat('app-runtime-integration-test-revoke')
        await deletePat(token.uid)

        const engine = new DataEngine(
            new RestAPILink({ baseUrl, apiVersion, apiToken: token.key })
        )

        await expect(
            engine.query({ me: { resource: 'me' } })
        ).rejects.toMatchObject({ type: 'access' })
    })

    it('confirms the PAT created by globalSetup is valid and functional', async () => {
        expect(apiToken).toBeTruthy()

        const engine = new DataEngine(
            new RestAPILink({ baseUrl, apiVersion, apiToken })
        )

        const result: any = await engine.query({
            systemInfo: {
                resource: 'system/info',
                params: { fields: 'version,contextPath' },
            },
        })

        expect(result.systemInfo.version).toMatch(/^2\.43/)
        expect(result.systemInfo.contextPath).toBe('http://localhost')
    })
})
