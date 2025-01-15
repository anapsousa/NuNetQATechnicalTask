import { When, Then } from "@cucumber/cucumber";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

When("latency is decreased to {int}ms", async (latency: number) => {
  // Remove latency using 'tc'
  await execAsync("docker exec node_a tc qdisc del dev eth0 root");
});

When("latency is increased to {int}ms", async (latency: number) => {
  // Remove existing latency
  await execAsync(`docker exec node_a tc qdisc del dev eth0 root || true`);
  // Add latency using 'tc'
  await execAsync(`docker exec node_a tc qdisc add dev eth0 root netem delay ${latency}ms`);
});

Then("the average ping RTT should be less than {int}ms", async (expectedRTT: number) => {
  const { stdout } = await execAsync("docker exec node_a ping -c 4 192.168.1.11");
  const rttMatch = stdout.match(/rtt.* = [\d.]+\/([\d.]+)/);
  if (!rttMatch || parseFloat(rttMatch[1]) > expectedRTT) {
    throw new Error(`RTT exceeds expected value: ${stdout}`);
  }
});
