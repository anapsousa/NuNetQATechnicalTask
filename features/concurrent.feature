Feature: Concurrent Connections
  Test behavior under multiple simultaneous connections

  @regression
  Scenario: Multiple nodes pinging a single node
    Given a network with node_a, node_b, and node_c
    When node_b and node_c simultaneously ping node_a 50 times
    Then all responses should be received without error
