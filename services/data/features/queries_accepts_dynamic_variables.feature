Feature: A static query can be executed with dynamic parameters

    Scenario: A query's parameters property is a function that expects a value and is executed with a value
        Given a query expects a value for a parameter
        When the query is executed with a value for that parameter
        Then the request contains a key value pair with the parameter and the provided value

    Scenario: A query's parameters property is a function that expects a value and is executed without a value
        Given a query expects a value for a parameter
        When the query is executed without a value for that parameter
        Then the request throws an error and rejects
