import { When, Then } from "@cucumber/cucumber";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

When("{int}% packet loss is introduced", async (loss: number) => {
  // Remove existing packet loss
  await execAsync(`docker exec node_a tc qdisc del dev eth0 root || true`);
  // Add packet loss using 'tc'
  await execAsync(`docker exec node_a tc qdisc add dev eth0 root netem loss ${loss}%`);
});

Then("at least {int}% of packets should be successfully delivered", {timeout: 50 * 1000}, async (successRate: number) => {
  const packets = 10;
  const { stdout } = await execAsync(`docker exec node_a ping -c ${packets} 192.168.1.11`);
  const received = (stdout.match(/bytes from/g) || []).length;
  const success = (received / packets) * 100;
  console.log(`\nPackets transmitted: ${packets}, Packets received: ${received}, Success rate: ${success}%`);
  if (success < successRate) {
    throw new Error(`\nPacket success rate below expectation: ${success}%`);
  }
});
