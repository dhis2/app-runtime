Feature: A pending query request can be aborted

    Scenario: A query request gets cancelled
        Given a query request is pending
        When the abort function is called
        Then the request stops
