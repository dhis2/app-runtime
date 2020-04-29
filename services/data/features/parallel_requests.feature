Feature: Requested resources of one query are being executed in parallel

    Scenario: The consumer requests multiple resources
        Given multiple resources are summarized in one query
        And the query has been executed
        Then all resources should be fetched in parallel

    Scenario: The consumer receives the response of multilple resources
        Given multiple resources are summarized in one query
        And not all resources have finished
        Then the query is still pending
        When all resources finish loading
        Then then the query responds with all resource responses
