import type { Name } from "@ndn/packet";
import { createContext } from "preact";

import type { NfdStatus } from "./model/nfd-status/types";

export const NfdStatusContext = createContext<NfdStatus>({} as any);
export const OldNfdStatusContext = createContext<NfdStatus>({} as any);

export interface NavFuncs {
  face(id?: number): void;
  rib(prefix?: Name): void;
  strategies(): void;
}

export const NavContext = createContext<NavFuncs>({
  face: () => undefined,
  rib: () => undefined,
  strategies: () => undefined,
});
