Feature: Throughput Testing
  Verify system behavior under high-bandwidth scenarios

  @flacky
  Scenario: Measuring throughput between nodes
    Given a network with node_a and node_b
    When node_a sends data to node_b at maximum speed for 10 seconds
    Then the throughput should not drop below 10 mbps
