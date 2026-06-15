#!/usr/bin/env node
'use strict'

// Simple test script for @dhis2/data-engine
// Usage: node node-engine-test.js --url https://play.dhis2.org/2.37.8 --apiKey <KEY>

const { DataEngine, RestAPILink } = require('@dhis2/data-engine')

const argv = process.argv.slice(2)
const parseArg = (name, short) => {
    const long = `--${name}`
    const s = `-${short}`
    const idx = argv.findIndex((a) => a === long || a === s)
    if (idx === -1) {
        return undefined
    }
    return argv[idx + 1]
}

const baseUrl = parseArg('url', 'u') || parseArg('baseUrl', 'b')
const apiKey = parseArg('apiKey', 'k') || parseArg('api-key', 'k')

if (!baseUrl || !apiKey) {
    console.error(
        'Usage: node node-engine-test.js --url <baseUrl> --apiKey <key>'
    )
    process.exit(2)
}

// Ensure global fetch exists (Node 18+). If not present, instruct the user.
if (typeof fetch === 'undefined') {
    console.error(
        'Global `fetch` is not available. Run this script with Node 18+ or provide a global fetch implementation.'
    )
    process.exit(3)
}

async function main() {
    try {
        const config = {
            baseUrl,
            apiToken: apiKey,
        }

        const engine = new DataEngine(new RestAPILink(config))

        console.log('Sending test queries to', baseUrl)

        // Make two simple queries: current user and system info
        const result = await engine.query({
            me: { resource: 'me' },
            systemInfo: { resource: 'system/info' },
        })

        console.log(
            'Hello, my name is ' + result.me.firstName + ' ' + result.me.surname
        )
        console.log('I am using DHIS2 version ' + result.systemInfo.version)

        // console.log(JSON.stringify(result, null, 2))
    } catch (err) {
        console.error('Request failed:')
        console.error(err && err.stack ? err.stack : err)
        process.exit(1)
    }
}

main()
