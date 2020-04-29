Feature: One or many resources can be requested

    Scenario: Requesting a single resource with a data response
        Given the "me" is being requested
        When the request succeeds
        Then the result includes the values of the "me" resource

    Scenario: Requesting a set of resources with a data response
        Given the "me" and "systemSettings" are being requested
        When the request succeeds
        Then both the result includes all values of the requested set of resources

    Scenario: Requesting a single resource with an error response
        Given the "me" are being requested
        When the request succeeds
        But the response contains an error
        Then the result contains the error
        And the result does not contain any data

    Scenario: Requesting a set of resources with an error response
        Given the "me" and "systemSettings" are being requested
        When the request succeeds
        But the response contains an error
        Then the result contains the error
        And the result does not contain any data for any resource
