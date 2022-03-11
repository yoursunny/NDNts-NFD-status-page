import { AltUri } from "@ndn/naming-convention2";

import { NfdStatusBase } from "./base";
import { Face, FaceFlags, NfdStatus, PacketCounters, Route, StrategyChoice } from "./types";

export function parseNfdStatusXml(doc: XMLDocument): NfdStatus {
  const result = new NfdStatusXml();
  result.parse(doc);
  return result;
}

class NfdStatusXml extends NfdStatusBase implements NfdStatus {
  public parse(doc: XMLDocument): void {
    if (doc.documentElement.namespaceURI !== "ndn:/localhost/nfd/status/1") {
      throw new Error("invalid XML");
    }
    for (const ele of iterElements(doc.documentElement)) {
      switch (ele.localName) {
        case "generalStatus":
          this.parseGeneralStatus(ele);
          break;
        case "faces":
          this.parseFaces(ele);
          break;
        case "rib":
          this.parseRib(ele);
          break;
        case "cs":
          this.parseCs(ele);
          break;
        case "strategyChoices":
          this.parseStrategyChoices(ele);
          break;
      }
    }
  }

  private parseGeneralStatus(gsEle: Element): void {
    assignElements(this.host, gsEle, {
      version: ["version", "str"],
      startTime: (text: string) => this.host.startTime = Date.parse(`${text}Z`),
      currentTime: (text: string) => this.timestamp = Date.parse(`${text}Z`),
    });
    assignElements(this.host.cnt, gsEle, {
      nNameTreeEntries: ["nameTreeEntry", "int"],
      nFibEntries: ["fibEntry", "int"],
      nPitEntries: ["pitEntry", "int"],
      nMeasurementsEntries: ["mtEntry", "int"],
      nCsEntries: ["csEntry", "int"],
      nSatisfiedInterests: ["pitSatisfy", "int"],
      nUnsatisfiedInterests: ["pitUnsatisfy", "int"],
      packetCounters: parsePacketCounters(this.host.cnt),
    });
  }

  private parseFaces(facesEle: Element): void {
    for (const faceEle of iterElements(facesEle)) {
      const face: Face = { flags: [], cnt: {} } as any;
      assignElements(face, faceEle, {
        faceId: ["id", "int"],
        localUri: ["local", "str"],
        remoteUri: ["remote", "str"],
        mtu: ["mtu", "int"],
        faceScope: collectFlag(face.flags, FaceFlags),
        facePersistency: collectFlag(face.flags, FaceFlags),
        linkType: collectFlag(face.flags, FaceFlags),
        congestion: () => face.flags.push("congestion-marking"),
        packetCounters: parsePacketCounters(face.cnt),
      });
      this.addFace(face);
    }
  }

  private parseRib(ribEle: Element): void {
    for (const ribEntryEle of iterElements(ribEle)) {
      const prefix: Pick<Route, "prefix"> = {} as any;
      assignElements(prefix, ribEntryEle, {
        prefix: ["prefix", "name"],
        routes: (text, routesEle) => {
          for (const routeEle of iterElements(routesEle)) {
            const route: Route = { ...prefix, childInherit: false, capture: false } as any;
            assignElements(route, routeEle, {
              faceId: ["nexthop", "int"],
              origin: ["origin", "str"],
              cost: ["cost", "int"],
              flags: (text, node) => {
                assignElements(route, node, {
                  childInherit: ["childInherit", "true"],
                  ribCapture: ["capture", "true"],
                });
              },
            });
            this.addRoute(route);
          }
        },
      });
    }
  }

  private parseCs(csEle: Element): void {
    assignElements(this.host.cnt, csEle, {
      nHits: ["csHit", "int"],
      nMisses: ["csMiss", "int"],
    });
  }

  private parseStrategyChoices(scsEle: Element): void {
    for (const scEle of iterElements(scsEle)) {
      const sc: StrategyChoice = {} as any;
      assignElements(sc, scEle, {
        namespace: ["prefix", "name"],
        strategy: (text, strategyEle) => {
          assignElements(sc, strategyEle, {
            name: ["strategy", "str"],
          });
        },
      });
      this.addStrategy(sc);
    }
  }
}

function* iterElements({ childNodes }: Node): Iterable<Element> {
  // eslint-disable-next-line unicorn/no-for-loop, @typescript-eslint/prefer-for-of
  for (let i = 0; i < childNodes.length; ++i) {
    const child = childNodes[i];
    if (child.nodeType === child.ELEMENT_NODE) {
      yield child as Element;
    }
  }
}

function assignElements<T extends Record<string, any>>(
    target: T, source: Node,
    schema: Record<string, [keyof T, "int" | "str" | "name" | "true"] | ((text: string, node: Element) => void)>,
): T {
  for (const ele of iterElements(source)) {
    const instruction = schema[ele.localName];
    if (!instruction) {
      continue;
    }
    const text = ele.textContent ?? "";
    if (typeof instruction === "function") {
      instruction(text, ele);
      continue;
    } else {
      const [dst, type] = instruction;
      switch (type) {
        case "int":
          (target as any)[dst] = Number.parseInt(text, 10);
          break;
        case "str":
          (target as any)[dst] = text;
          break;
        case "name":
          (target as any)[dst] = AltUri.parseName(text);
          break;
        case "true":
          (target as any)[dst] = true;
          break;
      }
    }
  }
  return target;
}

function collectFlag(target: any[], accepts: Record<string, any>): (text: string) => void {
  return (text: string) => {
    if (accepts[text]) {
      target.push(text);
    }
  };
}

function parsePacketCounters(target: PacketCounters): (text: string, packetCntEle: Node) => void {
  return (text, packetCntEle) => {
    for (const node of iterElements(packetCntEle)) {
      switch (node.localName) {
        case "incomingPackets":
          assignElements(target, node, {
            nInterests: ["rxInterest", "int"],
            nData: ["rxData", "int"],
            nNacks: ["rxNack", "int"],
          });
          break;
        case "outgoingPackets":
          assignElements(target, node, {
            nInterests: ["txInterest", "int"],
            nData: ["txData", "int"],
            nNacks: ["txNack", "int"],
          });
          break;
      }
    }
  };
}
