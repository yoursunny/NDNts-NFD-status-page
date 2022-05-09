export function describeIpAddr(ip: string): string {
  return ipNames.get(ip) ?? ip;
}

const ipNames = new Map<string, string>();

type TestbedNodes = Record<string, {
  ip_addresses?: string[];
}>;

(async () => {
try {
  const j: TestbedNodes = await (await fetch("https://ndndemo.arl.wustl.edu/testbed-nodes.json")).json();
  for (const [name, { ip_addresses }] of Object.entries(j)) {
    for (const ip of ip_addresses ?? []) {
      ipNames.set(ip, `${ip} (${name})`);
    }
  }
} catch (err: unknown) {
  console.warn(err);
}
})();
