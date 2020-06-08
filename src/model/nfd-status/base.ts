import { Version } from "@ndn/naming-convention1";
import { AltUri, Name } from "@ndn/packet";
import { fromHex, toHex } from "@ndn/tlv";
import DefaultMap from "mnemonist/default-map";
import MultiMap from "mnemonist/multi-map";

import type { Face, Host, NfdStatus, RibEntry, Route, StrategyChoice } from "./types";

export class NfdStatusBase implements NfdStatus {
  public readonly host: Host = { cnt: {} } as any;

  public readonly faces: Face[] = [];

  private readonly faceById = new Map<number, Face>();

  public getFace(id: number): Face|undefined {
    return this.faceById.get(id);
  }

  protected addFace(face: Face): void {
    describeFace(face);
    this.faces.push(face);
    this.faceById.set(face.id, face);
  }

  public get rib(): RibEntry[] {
    return Array.from(this.ribEntryByName.values());
  }

  public readonly routes: Route[] = [];

  private readonly ribEntryByName = new DefaultMap<string, RibEntry>(NfdStatusBase.makeRibEntry);
  private readonly routesByFace = new MultiMap<number, Route>();

  public getRibEntry(name: Name): RibEntry|undefined {
    const nameHex = toHex(name.value);
    return this.ribEntryByName.peek(nameHex);
  }

  public getFaceRoutes(id: number): Route[] {
    return this.routesByFace.get(id) ?? [];
  }

  protected addRoute(route: Route): void {
    const nameHex = toHex(route.prefix.value);
    const ribEntry = this.ribEntryByName.get(nameHex);
    ribEntry.capture = ribEntry.capture || route.capture;
    ribEntry.routes.push(route);
    this.routes.push(route);
    this.routesByFace.set(route.nexthop, route);

    if (LOCALHOST_NFD.equals(route.prefix)) {
      const face = this.faceById.get(route.nexthop);
      if (face && face.scheme === "unix") {
        face.title = "NFD-RIB management";
      }
    }
  }

  private static makeRibEntry(nameHex: string|undefined): RibEntry {
    const name = new Name(fromHex(nameHex!));
    return {
      prefix: name,
      capture: false,
      routes: [],
    };
  }

  public readonly strategies: StrategyChoice[] = [];
  public defaultStrategy = "";

  protected addStrategy(sc: StrategyChoice): void {
    describeStrategy(sc);
    this.strategies.push(sc);
    if (sc.prefix.length === 0) {
      this.defaultStrategy = sc.strategy;
    }
  }
}

const LOCALHOST_NFD = new Name("/localhost/nfd");

function describeFace(face: Face): void {
  face.scheme = face.remote.replace(/:.*$/, "");

  switch (face.scheme.replace(/\d$/, "")) {
    case "tcp":
      face.title = `TCP ${face.remote.slice(7)}`;
      break;
    case "udp":
      if (face.remote.endsWith(":56363")) {
        let m = /^udp4:\/\/([^:]+):\d+$/.exec(face.local);
        if (m) {
          face.title = `UDP IPv4 multicast on ${m[1]}`;
          break;
        }
        m = /^udp6:\/\/[^%]+%([^\]%]+)]:56363$/.exec(face.remote);
        if (m) {
          face.title = `UDP IPv6 multicast on ${m[1]}`;
          break;
        }
      }
      face.title = `UDP ${face.remote.slice(7)}`;
      break;
    case "fd":
      face.scheme = "unix";
      face.title = `UNIX fd=${face.remote.slice(5)}`;
      break;
    case "ether":
      if (face.remote === "ether://[01:00:5e:00:17:aa]") {
        face.title = `Ethernet multicast on ${face.local.slice(6)}`;
      }
      break;
    case "internal":
      face.title = "NFD management";
      break;
    case "contentstore":
      face.scheme = "internal";
      face.title = "Content Store";
      break;
    case "null":
      face.scheme = "internal";
      face.title = "packet drop";
      break;
  }
}

const LOCALHOST_NFD_STRATEGY = new Name("/localhost/nfd/strategy");

function describeStrategy(sc: StrategyChoice): void {
  const name = AltUri.parseName(sc.strategy);
  if (LOCALHOST_NFD_STRATEGY.isPrefixOf(name) &&
      name.length >= 5 && name.get(4)!.is(Version)) {
    sc.strategy = `${AltUri.ofComponent(name.get(3)!)} v${name.get(4)!.as(Version)} ${AltUri.ofName(name.slice(5)).slice(1)}`;
  }
}
