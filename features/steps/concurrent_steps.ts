import { When, Then } from "@cucumber/cucumber";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

When("node_b and node_c simultaneously ping node_a {int} times", {timeout: 60 * 1000}, async (count: number) => {
  await Promise.all([
    execAsync(`docker exec node_b ping -c ${count} 192.168.1.10`),
    execAsync(`docker exec node_c ping -c ${count} 192.168.1.10`),
  ]);
});

Then("all responses should be received without error", {timeout: 60 * 1000}, async () => {
  const results = await Promise.all([
    execAsync(`docker exec node_b ping -c 50 192.168.1.10`),
    execAsync(`docker exec node_c ping -c 50 192.168.1.10`),
  ]);
  results.forEach(({ stdout }) => {
    const transmittedMatch = stdout.match(/(\d+) packets transmitted/);
    if (!transmittedMatch) {
      throw new Error("Failed to parse transmitted packets");
    }
    const transmitted = parseInt(transmittedMatch[1], 10);
    const receivedMatch = stdout.match(/(\d+) received/);
    if (!receivedMatch) {
      throw new Error("Failed to parse received packets");
    }
    const received = parseInt(receivedMatch[1], 10);
    //in real world scenarios there's always a packet loss, so we can't expect 100% success rate
    const packetLoss = ((transmitted - received) / transmitted) * 100;
    if (packetLoss > 10) {
      throw new Error(`Packet loss occurred:\n${stdout}`);
    }
  });
});
