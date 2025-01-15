import { Given, When, Then } from "@cucumber/cucumber";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

Given("a node connected to the network", async () => {
  // Ensure the node is running and connected to the network
  const result = await execAsync("docker ps --filter name=node_a --format '{{.Names}}'");
  if (!result.stdout.trim().includes("node_a")) {
    throw new Error("Node 'node_a' is not connected to the network or not running.");
  }
  
  // Ensure the network environment is running
  await execAsync("docker compose up -d");
  await execAsync(`docker start node_b`);
  await execAsync(`docker start node_c`);

  // Verify network connectivity by pinging another node
  try {
    const pingResult = await execAsync("docker exec node_a ping -c 1 192.168.1.11");
    if (!pingResult.stdout.includes("1 packets transmitted, 1 received")) {
      throw new Error("Node 'node_a' is not properly connected to the network.");
    }
  } catch (error) {
    throw new Error(`Network connectivity verification failed: ${(error as Error).message}`);
  }
});

When("it performs a DNS lookup for {string}", async (domain: string) => {
    const { stdout } = await execAsync(`docker exec node_a nslookup ${domain}`);
    console.log(`DNS lookup result:\n${stdout}`);
    if (!stdout.includes("name =")) {
      throw new Error(`Failed to resolve domain ${domain}`);
    }
  });

Then("the IP address should be resolved correctly", async function () {
    const { stdout } = await execAsync(`docker exec node_a nslookup 192.168.1.12`);
    console.log(`DNS lookup result:\n${stdout}`);
    //TODO: for improvement of the test the then step shouldn't replicate the when step i.e. it shouldn't redo the action part of the code
    //instead we should save the action part result in a variable and use it in the then step
    if (!stdout.includes("name = node_c.nunetqatechnicaltask_network_test.")) {
      throw new Error(`Failed to resolve IP address 192.168.1.12`);
    }
  }); 