Feature: Multiple "filter" parameters are sent individually

    Scenario: A resource query has one filter value
        Given a query is provided one filter parameter value
        Then the request url contains one filter key value pair

    Scenario: A resource query has more than one filter value
        Given a query is provided multipe filter parameter values
        Then the request url contains a filter key value pair for each provided value
