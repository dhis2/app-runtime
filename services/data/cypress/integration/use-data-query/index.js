import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

const dataFixture = 'use-data-query/data'

Given('the query is being executed', () => {
    cy.server().route({
        method: 'GET',
        url: 'http://domain.tld',
        response: `fixture:${dataFixture}`,
        delay: 10000,
    })

    cy.visitStory('Use Data Query', 'Query')
})

Given('a resource does not exist', () => {
    cy.server().route({
        method: 'GET',
        url: 'http://domain.tld',
        response: `fixture:${dataFixture}`,
        force404: true,
    })

    cy.visitStory('Use Data Query', 'Query')
})

Then('loading should be true', () => {
    cy.all(
        () => cy.window(),
        () => cy.get('.loading')
    ).then(([win, $loading]) => {
        expect(win.loading).to.eql(true)
        expect($loading).to.exist()
    })
})

Then('an error should be given', () => {
    cy.all(
        () => cy.window(),
        () => cy.get('.error')
    ).then(([win, $error]) => {
        expect(win.error).to.deep.eql({})
        expect($error).to.exist()
    })
})
