Feature: Mutations are being validated

    Scenario: The user supplies an valid mutation
        Given a mutation is valid
        Then the mutation should be executed

    Scenario: The provided mutation's type is invalid
        Given one of the mutation's resource's type does not exist
        Then the mutation should reject with an error

    Scenario: The provided mutation lacks a type
        Given one of the mutation's resource does not have a type
        Then the mutation should reject with an error

    Scenario: The provided mutation is not an object
        Given the mutation is not an object
        Then the mutation should reject with an error

    Scenario: One of the resources is not an object
        Given one of the mutation's resources is not an object
        Then the mutation should reject with an error

    Scenario: The provided mutation lacks a resource
        Given the mutation is empty
        Then the mutation should reject with an error

    Scenario: The provided mutation's resource is not a string
        Given one of the mutation's resource's name is not a string
        Then the mutation should reject with an error

    Scenario: The provided mutation is of type "create" and has an id property
        Given one of the resources is of type "create"
        And the resource has an id property
        Then the mutation should reject with an error

    Scenario: The provided mutation's id is not a string
        Given one of the resources has an id property
        And the id is not a string
        Then the mutation should reject with an error

    Scenario: The provided mutation is of type "delete" and has a data property
        Given one of the resources is of type "delete"
        And the resource has a data property
        Then the mutation should reject with an error

    Scenario: The provided mutation contains invalid properties
        Given one of the mutation's resources has an invalid property
        Then the mutation should reject with an error
