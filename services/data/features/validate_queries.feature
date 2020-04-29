Feature: Queries are being validated

    Scenario: The user supplies an valid query
        Given a query is valid
        Then the query should be executed

    Scenario: The provided query's type is invalid
        Given one of the query's resource's type does not exist
        Then the query should reject with an error

    Scenario: The provided query lacks a type
        Given one of the query's resource does not have a type
        Then the query should reject with an error

    Scenario: The provided query is not an object
        Given the query is not an object
        Then the query should reject with an error

    Scenario: One of the resources is not an object
        Given one of the query's resources is not an object
        Then the query should reject with an error

    Scenario: The provided query lacks a resource
        Given the query is empty
        Then the query should reject with an error

    Scenario: The provided query's resource is not a string
        Given one of the query's resource's name is not a string
        Then the query should reject with an error

    Scenario: The provided query is of type "create" and has an id property
        Given one of the resources is of type "create"
        And the resource has an id property
        Then the query should reject with an error

    Scenario: The provided query's id is not a string
        Given one of the resources has an id property
        And the id is not a string
        Then the query should reject with an error

    Scenario: The provided query is of type "delete" and has a data property
        Given one of the resources is of type "delete"
        And the resource has a data property
        Then the query should reject with an error

    Scenario: The provided query contains invalid properties
        Given one of the query's resources has an invalid property
        Then the query should reject with an error
