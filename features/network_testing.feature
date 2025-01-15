Feature: Network Testing Harness

  @smoke @critical
  Scenario: Single destination ping
    Given a network with node_a and node_b
    When node_a pings node_b 5 times
    Then all packets should be successfully received

  @critical
  Scenario: Multi-actor ping
    Given a network with node_a, node_b, and node_c
    When node_a pings node_b and node_c simultaneously 10 times
    Then at least 90% of packets should be successfully received for all destinations
