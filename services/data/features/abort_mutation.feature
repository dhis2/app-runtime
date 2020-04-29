Feature: A pending mutation request can be aborted

    Scenario: A mutation request gets cancelled
        Given a mutation request is pending
        When the abort function is called
        Then the request stops
