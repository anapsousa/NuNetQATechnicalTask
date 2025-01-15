Feature: Network Latency
  To ensure the system performs well under high-latency conditions

  @regression
  Scenario: Simulating latency
    Given a network with node_a and node_b
    When latency is increased to 200ms
    Then the average ping RTT should be less than 250ms
