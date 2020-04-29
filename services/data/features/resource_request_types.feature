Feature: Mutations can have a type to transport their intended type of change

    Scenario: The user wants to add a new item
        Given a mutation's resource has type "create"
        Then the method of the request is of type "POST"

    Scenario: The user wants to add a update an existing item
        Given a mutation's resource has type "update"
        Then the method of the request is of type "PATCH"

    Scenario: The user wants to add a replace an existing item
        Given a mutation's resource has type "replace"
        Then the method of the request is of type "PUT"

    Scenario: The user wants to add a replace an existing item partially
        Given a mutation's resource has type "replace"
        And the mutation's resource only wants to replace partial data
        Then the method of the request is of type "PATCH"

    Scenario: The user wants to add a delete an existing item
        Given a mutation's resource has type "delete"
        Then the method of the request is of type "DELETE"
