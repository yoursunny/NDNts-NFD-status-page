import type { Name } from "@ndn/packet";
import { createContext } from "preact";

import type { NfdStatus } from "./model/nfd-status/types";

export const NfdStatusContext = createContext<NfdStatus>({} as any);
export const OldNfdStatusContext = createContext<NfdStatus>({} as any);

export const GotoFaceContext = createContext<(id?: number) => void>(() => undefined);
export const GotoRibContext = createContext<(prefix?: Name) => void>(() => undefined);
export const GotoStrategiesContext = createContext<() => void>(() => undefined);
