Feature: DHIS 2 specific action resources can be requested

    Scenario: A resource's string representation contains the action prefix
        Given a query's resource is an action endpoint
        Then the request url contains the action endpoint specific path segments

    Scenario: A resource's string representation does not contain the action prefix
        Given a query's resource is not an action endpoint
        Then the request url does not contain the action endpoint specific path segments
