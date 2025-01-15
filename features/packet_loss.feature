Feature: Packet Loss
  To verify system resilience under packet loss

  @flacky
  Scenario: Introducing packet loss
    Given a network with node_a and node_b
    When 10% packet loss is introduced
    Then at least 90% of packets should be successfully delivered
