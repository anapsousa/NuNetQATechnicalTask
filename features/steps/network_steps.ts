import { Given, When, Then } from "@cucumber/cucumber";
import { exec } from "child_process";
import { promisify } from "util";
import { setDefaultTimeout } from '@cucumber/cucumber';

const execAsync = promisify(exec);

let results: Record<string, number[]> = {};

setDefaultTimeout(60 * 1000);

Given("a network with node_a and node_b", async function () {
  // Ensure the network environment is running
  await execAsync("docker compose up -d");
});

Given("a network with node_a, node_b, and node_c", async function () {
  // Ensure the network environment is running
  await execAsync("docker compose up -d");
});

Given("a network with {string} and {string}", async (node1: string, node2: string) => {
  // Ensure both nodes are running
  await execAsync(`docker start ${node1}`);
  await execAsync(`docker start ${node2}`);
});

When("node_a pings node_b {int} times", async function (count: number) {
  const { stdout } = await execAsync(`docker exec node_a ping -c ${count} 192.168.1.11`);
  const received = (stdout.match(/bytes from/g) || []).length;
  results["node_b"] = [received, count];
});

When("node_a pings node_b and node_c simultaneously {int} times", async function (count: number) {
  const promises = [
    execAsync(`docker exec node_a ping -c ${count} 192.168.1.11`).then(({ stdout }) => {
      const received = (stdout.match(/bytes from/g) || []).length;
      results["node_b"] = [received, count];
    }),
    execAsync(`docker exec node_a ping -c ${count} 192.168.1.12`).then(({ stdout }) => {
      const received = (stdout.match(/bytes from/g) || []).length;
      results["node_c"] = [received, count];
    }),
  ];
  await Promise.all(promises);
});

Then("all packets should be successfully received", function () {
  Object.entries(results).forEach(([destination, [received, sent]]) => {
    if (received !== sent) {
      throw new Error(`Packets lost for ${destination}: ${sent - received}`);
    }
  });
});

Then("at least {int}% of packets should be successfully received for all destinations", function (threshold: number) {
  Object.entries(results).forEach(([destination, [received, sent]]) => {
    const successRate = (received / sent) * 100;
    if (successRate < threshold) {
      throw new Error(`Success rate for ${destination} is below threshold: ${successRate}%`);
    }
  });
});
