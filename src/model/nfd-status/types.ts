import type { Name } from "@ndn/packet";

export interface HostCounters {
  nameTreeEntry: number;
  fibEntry: number;
  pitEntry: number;
  pitSatisfy: number;
  pitUnsatisfy: number;
  mtEntry: number;
  csEntry: number;
  csHit: number;
  csMiss: number;
}

export interface PacketCounters {
  rxInterest: number;
  rxData: number;
  rxNack: number;
  txInterest: number;
  txData: number;
  txNack: number;
}

export interface Host {
  version: string;
  startTime: number;
  cnt: HostCounters & PacketCounters;
}

export const FaceFlags = {
  local: true,
  "on-demand": true,
  permanent: true,
  "multi-access": true,
  "congestion-marking": true,
};

export type FaceFlag = keyof typeof FaceFlags;

export interface Face {
  id: number;
  scheme: string;
  title: string;
  local: string;
  remote: string;
  mtu: number;
  flags: FaceFlag[];
  cnt: PacketCounters;
}

export interface Route {
  prefix: Name;
  nexthop: number;
  origin: string;
  cost: number;
  childInherit: boolean;
  capture: boolean;
}

export interface RibEntry {
  prefix: Name;
  capture: boolean;
  routes: Route[];
}

export interface StrategyChoice {
  prefix: Name;
  strategy: string;
}

export interface NfdStatus {
  readonly timestamp: number;
  readonly host: Host;

  readonly faces: Face[];
  getFace: (id: number) => Face | undefined;
  diffFaceCounters: (face: Face, prev?: NfdStatus) => PacketCounters;

  readonly rib: RibEntry[];
  readonly routes: Route[];
  getRibEntry: (name: Name) => RibEntry | undefined;
  getFaceRoutes: (id: number) => Route[];

  readonly strategies: StrategyChoice[];
  readonly defaultStrategy: string;
}
