Feature: useDataQuery

    Scenario: Resources are being loaded
        Given the query is being executed
        Then loading should be true

    Scenario: Loading the resources fails
        Given a resource does not exist
        Then an error should be given

    Scenario: Loading the resources finishes
        Given a query finishes
        Then the returned data should be accessible
