Feature: DNS Resolution
  To ensure DNS queries resolve correctly

  @regression
  Scenario: Resolving a domain name
    Given a node connected to the network
    When it performs a DNS lookup for "192.168.1.12"
    Then the IP address should be resolved correctly
