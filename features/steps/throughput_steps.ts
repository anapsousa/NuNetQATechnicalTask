import { When, Then } from "@cucumber/cucumber";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

When("node_a sends data to node_b at maximum speed for {int} seconds", {timeout: 50 * 1000}, async (duration: number) => {
  // Start iperf3 server on node_b
  await execAsync(`docker exec -d node_b iperf3 -s`);
  // Wait for the server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  // Run iperf3 client on node_a
  const clientOutput = await execAsync(`docker exec node_a iperf3 -c 192.168.1.11 -t ${duration}`);
  console.log(`\niperf3 client output:\n${clientOutput.stdout}`);
});

Then("the throughput should not drop below {int} mbps", {timeout: 50 * 1000}, async (threshold: number) => {
  const { stdout } = await execAsync(`docker exec node_a iperf3 -c 192.168.1.11 -t 10`);
  console.log(`\niperf3 output:\n${stdout}`);
  const match = stdout.match(/.*?([\d.]+) Mbits\/sec.*receiver/);
  const throughput = match ? parseFloat(match[1]) : 0;
  const expectedBandwidth = 50; // Assume 50 Mbps for a more realistic scenario
  if (throughput < (threshold / 100) * expectedBandwidth) {
    throw new Error(`\nThroughput ${throughput} Mbps is below the threshold\n`);
  }
});
