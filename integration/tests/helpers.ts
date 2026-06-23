import * as fs from 'fs'
import * as path from 'path'
import { DataEngine, RestAPILink } from '@dhis2/data-engine'

const CONFIG_FILE = path.join(__dirname, '..', '.integration-config.json')

export const config: { baseUrl: string; apiToken: string; apiVersion: number } =
    fs.existsSync(CONFIG_FILE)
        ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
        : {
              baseUrl: process.env.DHIS2_BASE_URL ?? '',
              apiToken: process.env.DHIS2_API_TOKEN ?? '',
              apiVersion: Number(process.env.DHIS2_API_VERSION ?? '43'),
          }

export const { baseUrl, apiToken, apiVersion } = config

export const ADMIN_USERNAME = process.env.DHIS2_USERNAME ?? 'admin'
export const ADMIN_PASSWORD = process.env.DHIS2_PASSWORD ?? 'district'
export const adminBasicAuth = `Basic ${Buffer.from(
    `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`
).toString('base64')}`

export const apiBase = `${baseUrl}/api/${apiVersion}`

export const describeOrSkip = baseUrl && apiToken ? describe : describe.skip

export function makeEngine(): DataEngine {
    return new DataEngine(new RestAPILink({ baseUrl, apiVersion, apiToken }))
}

export function makeLink(): RestAPILink {
    return new RestAPILink({ baseUrl, apiVersion, apiToken })
}
