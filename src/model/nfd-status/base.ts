import { Version } from "@ndn/naming-convention1";
import { AltUri, Component, Name } from "@ndn/packet";
import { fromHex, toHex } from "@ndn/tlv";
import DefaultMap from "mnemonist/default-map";
import MultiMap from "mnemonist/multi-map";

import { nameIncludes } from "../nameutil";
import type { Face, Host, NfdStatus, PacketCounters, RibEntry, Route, StrategyChoice } from "./types";

export class NfdStatusBase implements NfdStatus {
  public timestamp = 0;
  public readonly host: Host = { cnt: {} } as any;

  public readonly faces: Face[] = [];

  private readonly faceById = new Map<number, Face>();

  public getFace(id: number): Face|undefined {
    return this.faceById.get(id);
  }

  public diffFaceCounters(face: Face, prev?: NfdStatus): PacketCounters {
    const duration = this.timestamp - (prev?.timestamp ?? 0);
    return diffPacketCounters(face.cnt, prev?.getFace(face.id)?.cnt, duration);
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

    const face = this.faceById.get(route.nexthop);
    if (face) {
      describeFaceRoute(route, face);
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

function diffPacketCounters(current: PacketCounters, prev: PacketCounters|undefined, duration: number): PacketCounters {
  const result = { ...current };
  if (prev && duration > 0) {
    for (const [key, value] of Object.entries(current) as Iterable<[keyof PacketCounters, number]>) {
      result[key] = (value - prev[key]) / duration * 1000;
    }
  } else {
    for (const key of Object.keys(current) as Iterable<keyof PacketCounters>) {
      result[key] = 0;
    }
  }
  return result;
}

function prettyIp(s: string): string {
  s = s.replace(/:6363$/, "");
  if (s.startsWith("[") && s.endsWith("]")) {
    s = s.slice(1, -1);
  }
  return s;
}

function describeFace(face: Face): void {
  const { local, remote } = face;
  face.scheme = remote.replace(/:.*$/, "");
  face.title = face.remote;

  switch (face.scheme.replace(/\d$/, "")) {
    case "tcp":
      face.title = `TCP ${prettyIp(remote.slice(7))}`;
      break;
    case "udp":
      if (remote.endsWith(":56363")) {
        let m = /^udp4:\/\/([^:]+):\d+$/.exec(local);
        if (m) {
          face.title = `UDP IPv4 multicast on ${m[1]}`;
          break;
        }
        m = /^udp6:\/\/[^%]+%([^\]%]+)]:56363$/.exec(remote);
        if (m) {
          face.title = `UDP IPv6 multicast on ${m[1]}`;
          break;
        }
      }
      face.title = `UDP ${prettyIp(remote.slice(7))}`;
      break;
    case "fd":
      face.scheme = "unix";
      face.title = `UNIX fd=${remote.slice(5)}`;
      break;
    case "ether":
      if (remote === "ether://[01:00:5e:00:17:aa]") {
        face.title = `Ethernet multicast on ${local.slice(6)}`;
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

const LOCALHOST_NFD = new Name("/localhost/nfd");
const PING_SUFFIX = Component.from("ping");
const NLSR_INFO_SUFFIX_1 = Component.from("INFO");
const NLSR_INFO_SUFFIX_2 = Component.from("nlsr");
const NLSR_ROUTER_COMP = Component.from("%C1.Router");
const LOCALHOP_AUTOCONF_HUB = new Name("/localhop/ndn-autoconf/hub");

function describeFaceRoute({ prefix }: Route, face: Face): void {
  switch (true) {
    case face.scheme === "unix" && LOCALHOST_NFD.equals(prefix):
      face.title = "NFD-RIB management";
      break;
    case face.scheme === "unix" && prefix.get(-1)?.equals(PING_SUFFIX):
      face.title = `ping server ${AltUri.ofName(prefix.getPrefix(-1))}`;
      break;
    case face.scheme === "unix" &&
         prefix.get(-1)?.equals(NLSR_INFO_SUFFIX_1) &&
         prefix.get(-2)?.equals(NLSR_INFO_SUFFIX_2) &&
         nameIncludes(prefix, NLSR_ROUTER_COMP):
      face.title = `NLSR ${AltUri.ofName(prefix.getPrefix(-2))}`;
      break;
    case face.scheme === "unix" && LOCALHOP_AUTOCONF_HUB.equals(prefix):
      face.title = "autoconfig server";
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
