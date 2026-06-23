import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.DHIS2_BASE_URL ?? 'http://localhost:18080'
const USERNAME = process.env.DHIS2_USERNAME ?? 'admin'
const PASSWORD = process.env.DHIS2_PASSWORD ?? 'district'
const API_VERSION = Number(process.env.DHIS2_API_VERSION ?? '43')

const CONFIG_FILE = path.join(__dirname, '.integration-config.json')
const READY_TIMEOUT_MS = 5 * 60 * 1000

async function waitForDhis2(): Promise<void> {
    const pingUrl = `${BASE_URL}/api/system/ping`
    const deadline = Date.now() + READY_TIMEOUT_MS

    while (Date.now() < deadline) {
        try {
            // Use redirect: 'manual' — DHIS2 /api/system/ping redirects to
            // /login/ with a bare hostname (no port), which fetch can't follow.
            // Any response without a network error means DHIS2 is up.
            await fetch(pingUrl, { redirect: 'manual' })
            console.log(`\nDHIS2 ready at ${BASE_URL}`)
            return
        } catch {
            // not ready yet
        }
        process.stdout.write('.')
        await new Promise((r) => setTimeout(r, 5_000))
    }

    throw new Error(
        `DHIS2 did not become ready within ${READY_TIMEOUT_MS / 1000}s`
    )
}

async function createApiToken(): Promise<string> {
    const basicAuth = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64')

    const res = await fetch(`${BASE_URL}/api/${API_VERSION}/apiToken`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ type: 'PERSONAL_ACCESS_TOKEN_V2' }),
    })

    if (!res.ok) {
        throw new Error(
            `Failed to create API token: ${res.status} ${res.statusText}`
        )
    }

    const body = await res.json()
    const token: string =
        body.response?.key ?? body.key ?? body.token ?? body.apiToken
    if (!token) {
        throw new Error(
            `Unexpected response from apiToken endpoint: ${JSON.stringify(body)}`
        )
    }
    return token
}

export async function setup(): Promise<void> {
    await waitForDhis2()

    const apiToken = await createApiToken()

    const config = { baseUrl: BASE_URL, apiToken, apiVersion: API_VERSION }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    console.log('Integration config written to', CONFIG_FILE)
}
